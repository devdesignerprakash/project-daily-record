"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X, CalendarSearch, RefreshCw, ShieldAlert, FileSpreadsheet, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { NepaliDate } from "@zener/nepali-datepicker-react";
import NepaliDatePickerField, { toNepaliDateObj } from "@/components/ui/NepaliDatePickerField";

// BS month names exactly as they appear in the "Month" column of the
// Progress Records "All Data" sheet — index+1 is the BS month number.
const BS_MONTHS = [
  "वैशाख", "जेठ", "असार", "साउन", "भाद्र", "असोज",
  "कार्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत्र",
];

// File System Access API (Chrome/Edge, secure context incl. localhost) lets
// us write back to the exact file the user picked — no download/replace
// dance needed. Browsers without it (Firefox/Safari, or a plain LAN http://
// origin) fall back to the old pick-via-<input> + download flow below.
const supportsFileSystemAccess = () =>
  typeof window !== "undefined" && typeof window.showOpenFilePicker === "function";

const EXCEL_PICKER_OPTIONS = {
  types: [
    {
      description: "Excel Workbook",
      accept: {
        "application/vnd.ms-excel.sheet.macroEnabled.12": [".xlsm"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      },
    },
  ],
  excludeAcceptAllOption: false,
  multiple: false,
};

const ensureReadWritePermission = async (handle) => {
  const opts = { mode: "readwrite" };
  if ((await handle.queryPermission(opts)) === "granted") return true;
  if ((await handle.requestPermission(opts)) === "granted") return true;
  return false;
};

const ALL_DATA_SHEET_NAME = "All Data";

const findAllDataSheetName = (workbook) =>
  workbook.SheetNames.find((n) => n.trim() === ALL_DATA_SHEET_NAME) ||
  workbook.SheetNames.find((n) => n.toLowerCase().includes("all"));

// Reads the "All Data" sheet of an already-downloaded Progress Records
// workbook and returns the set of AD ("YYYY-MM-DD") dates it already has a
// row for (so we never suggest/append a duplicate date), plus the last SN
// used (so new rows continue the same running count) and the sheet's rows.
const readExistingExcelDates = (workbook) => {
  const sheetName = findAllDataSheetName(workbook);
  const entered = new Set();
  let lastSN = 0;
  if (!sheetName) return { entered, lastSN, sheetName };

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: null });
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const [sn, year, monthName, day] = row;
    if (Number.isFinite(Number(sn)) && Number(sn) > lastSN) lastSN = Number(sn);
    if (!year || !monthName || !day) continue;
    const monthIdx = BS_MONTHS.indexOf(String(monthName).trim());
    if (monthIdx === -1) continue;
    const bsStr = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    try {
      entered.add(new NepaliDate(bsStr).toAD("en").toString());
    } catch {
      // unparsable row (merged/blank/etc.) — skip it
    }
  }
  return { entered, lastSN, sheetName };
};

// Column order of the "All Data" sheet (21 columns). Fields with no source
// in the app's DB (route-permit "परिवर्तन"/"सरूवा सहमति", and राजश्व/revenue,
// which no module tracks at all) are left as 0 / "" for manual entry.
const buildAllDataRow = (sn, adDateStr, data) => {
  const nd = toNepaliDateObj(adDateStr);
  const [year, month, day] = nd.format("YYYY-MM-DD").split("-").map(Number);
  const monthName = BS_MONTHS[month - 1];

  const fit = data?.fitness || [];
  const pol = data?.pollution || [];
  const rp = data?.routePermit || [];
  const tr = data?.transportRegistration || [];
  const rw = data?.roadworthiness || [];
  const star = data?.starkayam || [];

  return [
    sn, year, monthName, day,
    sumField(fit, "naya"), sumField(fit, "nabikaran"), sumField(fit, "pratilipi"),
    sumField(pol, "pass"), sumField(pol, "fail"),
    sumField(rp, "naya"), sumField(rp, "nabikaran"), 0, sumField(rp, "pratilipi"), 0,
    sumField(tr, "naya"), sumField(tr, "thap"), sumField(tr, "nabikaran"),
    sumField(rw, "roadworthiness_test_done"),
    sumField(star, "naya"), sumField(star, "nabikaran"),
    "",
  ];
};

// ---------------------------------------------------------------------
// Surgical .xlsx/.xlsm zip editing.
//
// XLSX.writeFile() (SheetJS) re-parses and re-serializes the ENTIRE
// workbook from its internal model — every sheet, not just the one we
// touch. SheetJS's model doesn't fully round-trip everything an .xlsm can
// contain (e.g. it already warns and drops the newer data-validation
// extension on read), so a full write can visibly alter *other* sheets
// ("Selective Data", "Months") even though we never intended to change
// them. To guarantee those sheets stay byte-for-byte untouched, we edit
// the workbook as a plain zip archive and only rewrite the one XML part
// for the "All Data" worksheet — inserting new <row> elements as text
// right before its closing </sheetData>. Every other part of the archive
// (other worksheets, styles, macros, etc.) is carried through unchanged.
// ---------------------------------------------------------------------

const SSML_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const RELS_NS = "http://schemas.openxmlformats.org/package/2006/relationships";
const R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

const parseXml = (text, errorLabel) => {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) {
    throw new Error(`${errorLabel} पार्स गर्न सकिएन।`);
  }
  return doc;
};

// Resolves a package-relative Target (e.g. "../tables/table1.xml", as seen
// in a worksheet's own _rels file) against the directory containing the
// .rels file that named it — handles ".." segments, which naive prefix
// stripping does not.
const resolveZipPath = (baseDir, target) => {
  if (target.startsWith("/")) return target.slice(1);
  const parts = baseDir.split("/").filter(Boolean);
  for (const seg of target.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return parts.join("/");
};

// 1-indexed column number → Excel column letters (1 → A, 21 → U, ...).
const colLetter = (n) => {
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

// Resolves the "All Data" sheet's <sheet name>/r:id (in xl/workbook.xml) to
// its actual worksheet XML part path (via xl/_rels/workbook.xml.rels) —
// sheetN.xml filenames aren't guaranteed to match sheet display order.
const findAllDataWorksheetPath = async (zip) => {
  const workbookXml = await zip.file("xl/workbook.xml").async("string");
  const relsXml = await zip.file("xl/_rels/workbook.xml.rels").async("string");
  const wbDoc = parseXml(workbookXml, "workbook.xml");
  const relsDoc = parseXml(relsXml, "workbook.xml.rels");

  const sheetEl = Array.from(wbDoc.getElementsByTagNameNS(SSML_NS, "sheet"))
    .find((el) => (el.getAttribute("name") || "").trim() === ALL_DATA_SHEET_NAME);
  if (!sheetEl) throw new Error('"All Data" पाना workbook.xml मा फेला परेन।');

  const rId = sheetEl.getAttributeNS(R_NS, "id") || sheetEl.getAttribute("r:id");
  const relEl = Array.from(relsDoc.getElementsByTagNameNS(RELS_NS, "Relationship"))
    .find((el) => el.getAttribute("Id") === rId);
  if (!relEl) throw new Error("All Data पानाको सम्बन्ध (relationship) फेला परेन।");

  return resolveZipPath("xl", relEl.getAttribute("Target") || "");
};

const escapeXmlText = (str) =>
  String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// "All Data" isn't just a plain range — it's backed by a real Excel Table
// (named "Data"), whose first column (SN) is a *calculated column*
// (ROW()-ROW(Data[#Headers])), not typed-in numbers. Appending raw <row>
// cells without also extending the table's own range leaves new rows
// physically present but outside the table — invisible to anything built
// on top of it (the "Selective Data" sheet's FILTER(Data[...]) formula,
// the "Months" sheet's UNIQUE(Data[SN])). This resolves that table part
// (via the worksheet's own rels + <tableParts>) so the append step below
// can extend it alongside the new rows.
const findTableInfo = async (zip, worksheetPath, worksheetXmlText) => {
  const tablePartMatch = worksheetXmlText.match(/<tableParts[\s\S]*?<\/tableParts>/);
  if (!tablePartMatch) return null;
  const rIdMatch = tablePartMatch[0].match(/r:id="([^"]+)"/);
  if (!rIdMatch) return null;

  const dir = worksheetPath.slice(0, worksheetPath.lastIndexOf("/"));
  const fileName = worksheetPath.slice(worksheetPath.lastIndexOf("/") + 1);
  const relsPath = `${dir}/_rels/${fileName}.rels`;
  const relsFile = zip.file(relsPath);
  if (!relsFile) return null;

  const relsDoc = parseXml(await relsFile.async("string"), relsPath);
  const relEl = Array.from(relsDoc.getElementsByTagNameNS(RELS_NS, "Relationship"))
    .find((el) => el.getAttribute("Id") === rIdMatch[1]);
  if (!relEl) return null;

  const tablePath = resolveZipPath(dir, relEl.getAttribute("Target") || "");
  const tableFile = zip.file(tablePath);
  if (!tableFile) return null;
  const tableXml = await tableFile.async("string");

  const nameMatch = tableXml.match(/<table[^>]*\sname="([^"]+)"/);
  const refMatch = tableXml.match(/<table[^>]*\sref="([A-Z]+)1:([A-Z]+)(\d+)"/);
  if (!nameMatch || !refMatch) return null;

  const calcFormulaMatch = tableXml.match(
    /<tableColumn[^>]*\sname="SN"[^>]*>\s*<calculatedColumnFormula[^>]*>([^<]+)<\/calculatedColumnFormula>/
  );

  return {
    tablePath,
    tableXml,
    name: nameMatch[1],
    startCol: refMatch[1],
    endCol: refMatch[2],
    lastRow: parseInt(refMatch[3], 10),
    snFormula: calcFormulaMatch ? calcFormulaMatch[1] : null,
  };
};

// Extends the table's own range and its <autoFilter> range to cover the
// newly-appended rows (both currently point at the same "A1:U<oldLast>"
// string, so a single targeted substring replace covers both).
const extendTableRange = (zip, table, newLastRow) => {
  const oldRange = `${table.startCol}1:${table.endCol}${table.lastRow}`;
  const newRange = `${table.startCol}1:${table.endCol}${newLastRow}`;
  const updatedXml = table.tableXml.split(`ref="${oldRange}"`).join(`ref="${newRange}"`);
  zip.file(table.tablePath, updatedXml);
};

// Forces Excel to fully recalculate every formula the next time the file is
// opened — needed because our XML splice bypasses Excel's own edit/dirty
// tracking, so cached formula results (the FILTER/SORT in "Selective Data",
// UNIQUE in "Months") would otherwise keep showing stale values instead of
// picking up the newly-extended table.
const forceFullRecalcOnLoad = async (zip) => {
  const path = "xl/workbook.xml";
  const xml = await zip.file(path).async("string");
  if (/<calcPr[^>]*fullCalcOnLoad=/.test(xml)) return; // already set
  const updated = xml.includes("<calcPr")
    ? xml.replace(/<calcPr([^>]*)\/>/, (_m, attrs) => `<calcPr${attrs} fullCalcOnLoad="1"/>`)
    : xml.replace("</workbook>", '<calcPr fullCalcOnLoad="1"/></workbook>');
  zip.file(path, updated);
};

// Appends one <row> per missing date directly after the sheet's last
// existing row, by string-splicing new markup into the original XML text
// (never re-serializing it), so every byte before the insertion point —
// and every other worksheet part in the archive — is left exactly as-is.
// Also extends the "Data" table's own range (and its autoFilter) so the
// new rows are part of the table, not just adjacent cells — otherwise
// "Selective Data"'s FILTER(Data[...]) and "Months"'s UNIQUE(Data[SN])
// formulas can't see them (see findTableInfo above for why this matters).
const appendRowsToAllDataSheet = async (zip, worksheetPath, missingDates, perDateData) => {
  const xmlText = await zip.file(worksheetPath).async("string");
  const doc = parseXml(xmlText, '"All Data" worksheet XML');

  const sheetData = doc.getElementsByTagNameNS(SSML_NS, "sheetData")[0];
  if (!sheetData) throw new Error("sheetData फेला परेन।");

  const rowEls = Array.from(sheetData.getElementsByTagNameNS(SSML_NS, "row"));
  const lastRowEl = rowEls[rowEls.length - 1];
  const lastRowNum = lastRowEl ? parseInt(lastRowEl.getAttribute("r"), 10) : 1;

  const table = await findTableInfo(zip, worksheetPath, xmlText);

  // Pull the last row's per-column style ids (so new rows visually match)
  // and its SN (column A) value (so the running count continues).
  let lastSN = 0;
  const styleByCol = {};
  if (lastRowEl) {
    Array.from(lastRowEl.getElementsByTagNameNS(SSML_NS, "c")).forEach((c) => {
      const ref = c.getAttribute("r") || "";
      const col = ref.match(/^[A-Z]+/)?.[0];
      const s = c.getAttribute("s");
      if (col && s != null) styleByCol[col] = s;
      if (col === "A") {
        const vEl = c.getElementsByTagNameNS(SSML_NS, "v")[0];
        lastSN = vEl ? Number(vEl.textContent) || 0 : 0;
      }
    });
  }
  const spans = lastRowEl?.getAttribute("spans") || "1:21";

  const rowsXml = missingDates.map((date, idx) => {
    const rowNum = lastRowNum + 1 + idx;
    const sn = lastSN + idx + 1;
    const values = buildAllDataRow(sn, date, perDateData[idx]);
    const cellsXml = values.map((val, colIdx) => {
      const col = colLetter(colIdx + 1);
      const ref = `${col}${rowNum}`;
      const styleAttr = styleByCol[col] ? ` s="${styleByCol[col]}"` : "";

      // Column A (SN): reproduce the table's own calculated-column formula
      // instead of a typed-in number, so it stays a real calculated column.
      if (colIdx === 0 && table?.snFormula) {
        return `<c r="${ref}"${styleAttr} cm="1"><f t="array" ref="${ref}">${escapeXmlText(table.snFormula)}</f><v>${sn}</v></c>`;
      }
      if (val === "" || val === null || val === undefined) return "";
      if (typeof val === "string") {
        return `<c r="${ref}"${styleAttr} t="inlineStr"><is><t xml:space="preserve">${escapeXmlText(val)}</t></is></c>`;
      }
      return `<c r="${ref}"${styleAttr}><v>${val}</v></c>`;
    }).join("");
    return `<row r="${rowNum}" spans="${spans}">${cellsXml}</row>`;
  }).join("");

  let finalXml = xmlText.replace("</sheetData>", `${rowsXml}</sheetData>`);

  const lastNewRowNum = lastRowNum + missingDates.length;
  finalXml = finalXml.replace(
    /(<dimension ref="[A-Z]+\d+:[A-Z]+)\d+("\s*\/>)/,
    (_m, prefix, suffix) => `${prefix}${lastNewRowNum}${suffix}`
  );

  zip.file(worksheetPath, finalXml);

  if (table) {
    extendTableRange(zip, table, lastNewRowNum);
  }
  await forceFullRecalcOnLoad(zip);
};

const sumField = (arr, field) => (arr || []).reduce((s, r) => s + (Number(r[field]) || 0), 0);

const todayStr = () => new Date().toISOString().slice(0, 10);

// AD "YYYY-MM-DD" → Nepali (BS) "YYYY/MM/DD" in Devanagari digits, for
// display in the तपसिल header and Excel exports.
const toBsLabel = (adDateStr) => {
  const nd = toNepaliDateObj(adDateStr);
  return nd ? nd.format("YYYY/MM/DD", "np") : adDateStr;
};

// Same तपसिल row mapping used by the official letter (LetterModal) —
// keeps this admin summary and the printed letter consistent.
const buildRows = (data) => {
  const fitList  = data?.fitness  || [];
  const rpList   = data?.routePermit || [];
  const rwList   = data?.roadworthiness || [];
  const polList  = data?.pollution || [];
  const mechList = data?.mechanicalTest || [];
  const patList  = data?.patake || [];
  const starList = data?.starkayam || [];
  const monList  = data?.monitoring || [];
  const trList   = data?.transportRegistration || [];

  return [
    {
      sn: "१", name: "अन्तर प्रदेशीय रुट इजाजतपत्र",
      naya: sumField(rpList, "naya"),
      nabikaran: sumField(rpList, "nabikaran"),
    },
    {
      sn: "२", name: "सवारी जाँचपास",
      naya: sumField(fitList, "naya"),
      nabikaran: sumField(fitList, "nabikaran"),
    },
    {
      sn: "३", name: "पटके",
      naya: sumField(patList, "count"),
      nabikaran: 0,
    },
    {
      sn: "४", name: "यान्त्रिक परीक्षण (Vehicle Fitness Test Center)",
      naya: sumField(mechList, "count"),
      nabikaran: 0,
    },
    {
      sn: "५", name: "प्रदुषण जाँचपास",
      naya: sumField(polList, "pass") + sumField(polList, "fail"),
      nabikaran: 0,
    },
    {
      sn: "६", name: "Road Worthiness Test",
      naya: 0,
      nabikaran: sumField(rwList, "roadworthiness_test_done"),
    },
    {
      sn: "७", name: "यातायात सेवा पञ्जीकरण संख्या",
      naya: sumField(trList, "naya") + sumField(trList, "thap"),
      nabikaran: sumField(trList, "nabikaran"),
    },
    {
      sn: "८", name: "स्तर कायम",
      naya: sumField(starList, "naya"),
      nabikaran: sumField(starList, "nabikaran"),
    },
    {
      sn: "९", name: "कारखाना वर्कसप / सवारी परीक्षण केन्द्रमा अनुगमन",
      naya: sumField(monList, "naya"),
      nabikaran: sumField(monList, "nabikaran"),
    },
  ];
};

// Builds one तपसिल block (title + subheader + 9 rows + total row) as an
// array-of-arrays, ready to be concatenated into a single sheet.
const buildBlock = (rows, titleLine) => {
  const naya      = rows.reduce((s, r) => s + (r.naya || 0), 0);
  const nabikaran = rows.reduce((s, r) => s + (r.nabikaran || 0), 0);

  return [
    ["सि.नं.", "क्रियाकलाप/विवरण (संख्या)", titleLine, "", ""],
    ["", "", "नयाँ", "नवीकरण", "जम्मा"],
    ...rows.map((row) => [
      row.sn,
      row.name,
      row.naya || 0,
      row.nabikaran || 0,
      (row.naya || 0) + (row.nabikaran || 0),
    ]),
    ["", "जम्मा", naya, nabikaran, naya + nabikaran],
  ];
};

// Merge spec (सि.नं./activity column-span + title row-span) for a block
// starting at sheet row `startRow`.
const blockMerges = (startRow) => [
  { s: { r: startRow, c: 0 }, e: { r: startRow + 1, c: 0 } },
  { s: { r: startRow, c: 1 }, e: { r: startRow + 1, c: 1 } },
  { s: { r: startRow, c: 2 }, e: { r: startRow, c: 4 } },
];

export default function AdminRecordsModal({ isOpen, onClose }) {
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate]     = useState(todayStr());
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [prevDayLoading, setPrevDayLoading] = useState(false);
  const [error, setError]       = useState("");
  const [missingDates, setMissingDates] = useState(null); // null = not checked yet
  const [checkingMissing, setCheckingMissing] = useState(false);
  const [appendingRows, setAppendingRows] = useState(false);
  const excelFileInputRef = useRef(null);
  // Raw bytes of the last file the user selected, kept so the "append" step
  // can zip-edit the exact same archive instead of asking the user to pick
  // the file twice.
  const loadedFileBufferRef = useRef(null);
  // Only set when the File System Access API was used to pick the file —
  // lets us write the result straight back to that same file on disk.
  const fileHandleRef = useRef(null);
  const [loadedFileMeta, setLoadedFileMeta] = useState(null); // { name, isXlsm }
  const [hasWritableHandle, setHasWritableHandle] = useState(false); // mirrors fileHandleRef for render

  const fetchRecords = useCallback(async (from, to) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/records-by-range", { params: { startDate: from, endDate: to } });
      setRows(buildRows(res.data));
    } catch (err) {
      setError(err.message || "विवरण ल्याउन समस्या भयो।");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (isOpen) {
      void (async () => {
        if (active) {
          await fetchRecords(fromDate, toDate);
        }
      })();
    }
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const totalNaya      = rows.reduce((s, r) => s + (r.naya || 0), 0);
  const totalNabikaran = rows.reduce((s, r) => s + (r.nabikaran || 0), 0);
  const grandTotal      = totalNaya + totalNabikaran;

  const rangeLabel = fromDate === toDate
    ? `मिति ${toBsLabel(fromDate)}`
    : `मिति ${toBsLabel(fromDate)} देखि ${toBsLabel(toDate)} सम्म`;

  const downloadExcel = () => {
    const titleLine = `सवारी परीक्षण कार्यालय टेकु, ${rangeLabel}`;

    const aoa = [
      ["सि.नं.", "क्रियाकलाप/विवरण (संख्या)", titleLine, "", ""],
      ["", "", "नयाँ", "नवीकरण", "जम्मा"],
      ...rows.map((row) => [
        row.sn,
        row.name,
        row.naya || 0,
        row.nabikaran || 0,
        (row.naya || 0) + (row.nabikaran || 0),
      ]),
      ["", "जम्मा", totalNaya, totalNabikaran, grandTotal],
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
      { s: { r: 0, c: 2 }, e: { r: 0, c: 4 } },
    ];
    ws["!cols"] = [{ wch: 6 }, { wch: 40 }, { wch: 12 }, { wch: 12 }, { wch: 10 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "तपसिल");
    XLSX.writeFile(wb, `all-modules-${fromDate}-to-${toDate}.xlsx`);
  };

  // Independent of the from/to range picker above. "Previous day" means the
  // last calendar date (before today) that actually has any data recorded —
  // not necessarily yesterday, since weekends/holidays may have no entries
  // at all. That block goes on top, then a 4-row gap, then today's block,
  // in a single sheet using the same layout as the plain Excel export.
  const downloadExcelWithPreviousDay = async () => {
    setPrevDayLoading(true);
    setError("");
    try {
      const lastEntryRes = await api.get("/api/admin/last-entry-date");
      const previousDate =  lastEntryRes.date;
      if (!previousDate) {
        setError("अघिल्लो कुनै पनि मितिमा डाटा फेला परेन।");
        return;
      }

      const today = todayStr();
      const [prevRes, todayRes] = await Promise.all([
        api.get("/api/admin/records-by-range", { params: { startDate: previousDate, endDate: previousDate } }),
        api.get("/api/admin/records-by-range", { params: { startDate: today, endDate: today } }),
      ]);

      const blockA = buildBlock(
        buildRows(prevRes.data),
        `सवारी परीक्षण कार्यालय टेकु, मिति ${toBsLabel(previousDate)} (अघिल्लो प्रविष्टि मिति)`
      );
      const blankRow = ["", "", "", "", ""];
      const blockB = buildBlock(
        buildRows(todayRes.data),
        `सवारी परीक्षण कार्यालय टेकु, मिति ${toBsLabel(today)} (आजको दिन)`
      );
      const blockBStart = blockA.length + 4;

      const aoa = [...blockA, blankRow, blankRow, blankRow, blankRow, ...blockB];

      const ws = XLSX.utils.aoa_to_sheet(aoa);
      ws["!merges"] = [...blockMerges(0), ...blockMerges(blockBStart)];
      ws["!cols"] = [{ wch: 6 }, { wch: 40 }, { wch: 12 }, { wch: 12 }, { wch: 10 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "तपसिल");
      XLSX.writeFile(wb, `कार्यालयकाे दैनिक विवरण-${toNepaliDateObj(previousDate)}_${toNepaliDateObj(today)}.xlsx`);
    } catch (err) {
      setError(err.message || "एक्सेल डाउनलोड गर्न समस्या भयो।");
    } finally {
      setPrevDayLoading(false);
    }
  };

  // Shared by both pick paths below: parses the workbook (read-only, via
  // SheetJS — just to diff dates), and separately keeps the raw file bytes
  // for the append step, which edits the zip archive directly instead.
  const processSelectedExcelFile = async (file) => {
    setCheckingMissing(true);
    setError("");
    setMissingDates(null);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const { entered: enteredDates, sheetName } = readExistingExcelDates(workbook);
      if (!sheetName) {
        setError('"All Data" पाना यस फाइलमा फेला परेन।');
        return;
      }

      const res = await api.get("/api/admin/data-dates");
      const availableDates = res.dates || [];

      const missing = availableDates.filter((d) => !enteredDates.has(d)).sort();
      loadedFileBufferRef.current = buffer;
      setLoadedFileMeta({ name: file.name, isXlsm: /\.xlsm$/i.test(file.name) });
      setMissingDates(missing);
    } catch (err) {
      setError(err.message || "एक्सेल जाँच गर्न समस्या भयो।");
    } finally {
      setCheckingMissing(false);
    }
  };

  // Preferred path (Chrome/Edge): showOpenFilePicker gives us a handle we
  // can later write straight back to, so no separate download+replace step
  // is needed. Falls back to a plain <input type=file> + download when the
  // API isn't available (Firefox/Safari, or a non-secure LAN http:// origin).
  const triggerMissingDatesCheck = async () => {
    if (!supportsFileSystemAccess()) {
      excelFileInputRef.current?.click();
      return;
    }
    try {
      const [handle] = await window.showOpenFilePicker(EXCEL_PICKER_OPTIONS);
      fileHandleRef.current = handle;
      setHasWritableHandle(true);
      const file = await handle.getFile();
      await processSelectedExcelFile(file);
    } catch (err) {
      if (err?.name !== "AbortError") {
        setError(err.message || "फाइल छनोट गर्न समस्या भयो।");
      }
    }
  };

  const handleExcelFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    fileHandleRef.current = null; // no writable handle via <input> — will fall back to download
    setHasWritableHandle(false);
    await processSelectedExcelFile(file);
  };

  // Fetches each missing date's data (reusing the same per-day endpoint the
  // rest of the app already uses) and surgically appends one row per date
  // into the "All Data" worksheet's XML inside the zip archive — every
  // other part of the archive (other sheets, styles, macros) is carried
  // through byte-for-byte untouched. Writes straight back to the original
  // file when we hold a writable handle for it; otherwise downloads the
  // updated workbook for the user to replace the original with by hand.
  const handleAppendMissingRows = async () => {
    const buffer = loadedFileBufferRef.current;
    if (!buffer || !missingDates || missingDates.length === 0) return;

    setAppendingRows(true);
    setError("");
    try {
      const zip = await JSZip.loadAsync(buffer);
      const worksheetPath = await findAllDataWorksheetPath(zip);

      const perDateData = await Promise.all(
        missingDates.map((date) => api.get("/api/admin/records-by-date", { params: { date } }))
      );

      await appendRowsToAllDataSheet(zip, worksheetPath, missingDates, perDateData.map((r) => r.data));

      const outBuffer = await zip.generateAsync({ type: "arraybuffer" });
      const handle = fileHandleRef.current;

      if (handle) {
        const hasPermission = await ensureReadWritePermission(handle);
        if (!hasPermission) {
          throw new Error("फाइलमा लेख्ने अनुमति (write permission) पाइएन।");
        }
        const writable = await handle.createWritable();
        await writable.write(outBuffer);
        await writable.close();
      } else {
        const outName = loadedFileMeta?.name?.replace(/(\.xlsm|\.xlsx)$/i, " (updated)$1")
          || "Progress Records (updated).xlsm";
        const mime = loadedFileMeta?.isXlsm
          ? "application/vnd.ms-excel.sheet.macroEnabled.12"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const url = URL.createObjectURL(new Blob([outBuffer], { type: mime }));
        const a = document.createElement("a");
        a.href = url;
        a.download = outName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }

      // Keep the buffer in sync so a second append (without re-picking the
      // file) continues from the just-appended state.
      loadedFileBufferRef.current = outBuffer;
      setMissingDates([]);
    } catch (err) {
      setError(err.message || "डाटा थप्न समस्या भयो।");
    } finally {
      setAppendingRows(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              मिति अनुसार सबै विवरण (All Modules — तपसिल)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              छानिएको मिति सीमाको सबै मोड्युलको जम्मा विवरण।
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Date range picker ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">देखि मिति (From)</label>
            <NepaliDatePickerField
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full sm:w-44"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">सम्म मिति (To)</label>
            <NepaliDatePickerField
              value={toDate}
              min={fromDate}
              max={todayStr()}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full sm:w-44"
            />
          </div>
          <Button
            onClick={() => fetchRecords(fromDate, toDate)}
            disabled={loading || !fromDate || !toDate}
            className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-sm flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CalendarSearch className="w-4 h-4" />}
            हेर्नुहोस् (View)
          </Button>
          <Button
            variant="outline"
            onClick={downloadExcel}
            disabled={loading || rows.length === 0}
            className="text-sm border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            एक्सेल डाउनलोड
          </Button>
          <Button
            variant="outline"
            onClick={downloadExcelWithPreviousDay}
            disabled={prevDayLoading}
            title="अघिल्लो दिनको तपसिल माथि, ४ लाइन खाली छोडेर आजको तपसिल तल — एउटै एक्सेलमा"
            className="text-sm border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400 flex items-center gap-1.5"
          >
            {prevDayLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 shrink-0" />}
            अघिल्लो दिनको डाटा सहित एक्सेल
          </Button>
          <input
            ref={excelFileInputRef}
            type="file"
            accept=".xlsx,.xlsm"
            className="hidden"
            onChange={handleExcelFileSelected}
          />
          <Button
            variant="outline"
            onClick={triggerMissingDatesCheck}
            disabled={checkingMissing}
            title="Progress Records.xlsm छान्नुहोस् — डाटा भएका तर एक्सेलमा अझै नछिरेका मितिहरू देखाउँछ"
            className="text-sm border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400 flex items-center gap-1.5"
          >
            {checkingMissing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ListChecks className="w-4 h-4 shrink-0" />}
            एक्सेलमा नछिरेका मितिहरू जाँच्नुहोस्
          </Button>
        </div>

        {/* ── Missing-dates result panel ── */}
        {missingDates !== null && (
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-amber-50/60 dark:bg-amber-950/20">
            {missingDates.length === 0 ? (
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                ✓ डाटा भएका सबै मितिहरू एक्सेलमा पहिले नै छिरिसकेका छन्।
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                    एक्सेलमा नछिरेका {missingDates.length} मिति (डाटा भएका):
                  </p>
                  <Button
                    size="sm"
                    onClick={handleAppendMissingRows}
                    disabled={appendingRows}
                    className="bg-amber-700 hover:bg-amber-600 text-white text-xs flex items-center gap-1.5 shrink-0"
                  >
                    {appendingRows ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />}
                    {hasWritableHandle ? "एक्सेलमा थप्नुहोस् (सोही फाइलमा सेभ)" : "एक्सेलमा थपेर डाउनलोड गर्नुहोस्"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {missingDates.map((d) => (
                    <span
                      key={d}
                      title={toBsLabel(d)}
                      className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-mono"
                    >
                      {toBsLabel(d)}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-500/80">
                  नोट: थपिएका पङ्क्तिहरूमा &quot;जम्मा राजश्व&quot; स्तम्भ खाली रहन्छ (एपमा राजश्व ट्र्याक हुँदैन) — पछि म्यानुअली भर्नुहोस्।{" "}
                  {hasWritableHandle
                    ? "बटन थिच्दा सोही Progress Records फाइलमा नयाँ पङ्क्तिहरू सीधै सेभ हुन्छन्।"
                    : "यो ब्राउजरमा फाइलमा सीधै लेख्ने सुविधा छैन, त्यसैले अपडेट भएको प्रति डाउनलोड हुन्छ — त्यसलाई आफैं पुरानो फाइलमाथि सार्नुपर्छ (Chrome/Edge प्रयोग गर्नुभयो भने यो म्यानुअल चरण चाहिँदैन)।"}
                </p>
              </>
            )}
          </div>
        )}

        {/* ── Body: single तपसिल-style datatable ── */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-zinc-950">
          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              ⚠ {error}
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                <TableRow>
                  <TableHead rowSpan={2} className="text-xs border-r border-slate-200 dark:border-zinc-800 align-middle">
                    सि.नं.
                  </TableHead>
                  <TableHead rowSpan={2} className="text-xs border-r border-slate-200 dark:border-zinc-800 align-middle">
                    क्रियाकलाप/विवरण (संख्या)
                  </TableHead>
                  <TableHead colSpan={3} className="text-xs text-center font-bold">
                    सवारी परीक्षण कार्यालय टेकु, {rangeLabel}
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="text-xs text-center border-r border-slate-200 dark:border-zinc-800">नयाँ</TableHead>
                  <TableHead className="text-xs text-center border-r border-slate-200 dark:border-zinc-800">नवीकरण</TableHead>
                  <TableHead className="text-xs text-center">जम्मा</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-8 text-xs">
                      {loading ? "लोड हुँदैछ..." : "यस मिति सीमामा कुनै रेकर्ड छैन।"}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {rows.map((row) => (
                      <TableRow key={row.sn} className="border-b border-slate-100 dark:border-zinc-900 text-xs">
                        <TableCell className="text-center font-medium text-slate-600 border-r border-slate-100 dark:border-zinc-900">
                          {row.sn}
                        </TableCell>
                        <TableCell className="border-r border-slate-100 dark:border-zinc-900">{row.name}</TableCell>
                        <TableCell className="text-center font-semibold border-r border-slate-100 dark:border-zinc-900">
                          {row.naya || 0}
                        </TableCell>
                        <TableCell className="text-center font-semibold border-r border-slate-100 dark:border-zinc-900">
                          {row.nabikaran || 0}
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-900 dark:text-zinc-100">
                          {(row.naya || 0) + (row.nabikaran || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-slate-100 dark:bg-zinc-800 font-bold text-xs">
                      <TableCell className="border-r border-slate-200 dark:border-zinc-700" />
                      <TableCell className="border-r border-slate-200 dark:border-zinc-700">जम्मा</TableCell>
                      <TableCell className="text-center border-r border-slate-200 dark:border-zinc-700">{totalNaya}</TableCell>
                      <TableCell className="text-center border-r border-slate-200 dark:border-zinc-700">{totalNabikaran}</TableCell>
                      <TableCell className="text-center text-blue-900 dark:text-blue-400">{grandTotal}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-end rounded-b-2xl">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs md:text-sm border-slate-200 dark:border-zinc-800 dark:text-zinc-300"
          >
            बन्द गर्नुहोस् (Close)
          </Button>
        </div>
      </div>
    </div>
  );
}
