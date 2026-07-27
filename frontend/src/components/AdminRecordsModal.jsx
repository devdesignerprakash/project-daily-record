"use client";

import { useState, useCallback, useEffect } from "react";
import { X, CalendarSearch, RefreshCw, ShieldAlert, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const sumField = (arr, field) => (arr || []).reduce((s, r) => s + (Number(r[field]) || 0), 0);

const todayStr = () => new Date().toISOString().slice(0, 10);

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

export default function AdminRecordsModal({ isOpen, onClose }) {
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate]     = useState(todayStr());
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

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

  const rangeLabel = fromDate === toDate ? `मिति ${fromDate}` : `मिति ${fromDate} देखि ${toDate} सम्म`;

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
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">देखि मिति (From)</label>
            <Input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-sm bg-transparent border-slate-200 dark:border-zinc-800 w-full sm:w-44"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">सम्म मिति (To)</label>
            <Input
              type="date"
              value={toDate}
              min={fromDate}
              max={todayStr()}
              onChange={(e) => setToDate(e.target.value)}
              className="text-sm bg-transparent border-slate-200 dark:border-zinc-800 w-full sm:w-44"
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
        </div>

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
