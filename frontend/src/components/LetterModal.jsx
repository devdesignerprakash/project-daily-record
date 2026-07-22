"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Printer, RefreshCw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

// ── helper: sum a field across an array ──────────────────────────
const sumField = (arr, field) => (arr || []).reduce((s, r) => s + (Number(r[field]) || 0), 0);

export default function LetterModal({ isOpen, onClose }) {
  // ── editable header fields ────────────────────────────────────
  const [miti,              setMiti]              = useState("२०८३/०४/०४");
  const [signerName,        setSignerName]        = useState("निर्मला खनाल दाहाल");
  const [signerDesignation, setSignerDesignation] = useState("शाखा अधिकृत");

  // ── fetch / loading state ─────────────────────────────────────
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState("");

  // ── editable table rows ───────────────────────────────────────
  const [rows, setRows] = useState([
    { sn: "१", name: "अन्तर प्रदेशीय रुट इजाजतपत्र",                          naya: 0, nabikaran: 0 },
    { sn: "२", name: "सवारी जाँचपास",                                            naya: 0, nabikaran: 0 },
    { sn: "३", name: "पटके",                                                      naya: 0, nabikaran: 0 },
    { sn: "४", name: "यान्त्रिक परीक्षण (Vehicle Fitness Test Center)",           naya: 0, nabikaran: 0 },
    { sn: "५", name: "प्रदुषण जाँचपास",                                           naya: 0, nabikaran: 0 },
    { sn: "६", name: "Road Worthiness Test",                                      naya: 0, nabikaran: 0 },
    { sn: "७", name: "यातायात सेवा पञ्जीकरण संख्या",                             naya: 0, nabikaran: 0 },
    { sn: "८", name: "स्तर कायम",                                                 naya: 0, nabikaran: 0 },
    { sn: "९", name: "कारखाना वर्कसप / सवारी परीक्षण केन्द्रमा अनुगमन",        naya: 0, nabikaran: 0 },
  ]);

  // ── fetch from all APIs ───────────────────────────────────────
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const [fitRes, rpRes, polRes, rwRes, mechRes, patRes, starRes, monRes, trRes] = await Promise.all([
        api.get("/api/fitness/by-date"),
        api.get("/api/route-permit/by-date"),
        api.get("/api/pollution/by-date"),
        api.get("/api/roadworthiness/by-date"),
        api.get("/api/mechanical-test/by-date"),
        api.get("/api/patake/by-date"),
        api.get("/api/starkayam/by-date"),
        api.get("/api/monitoring/by-date"),
        api.get("/api/transport-registration/by-date"),
      ]);

      const fitList  = fitRes.data  || [];
      const rpList   = rpRes.data   || [];
      const polList  = polRes.data  || [];
      const rwList   = rwRes.data   || [];
      const mechList = mechRes.data || [];
      const patList  = patRes.data  || [];
      const starList = starRes.data || [];
      const monList  = monRes.data  || [];
      const trList   = trRes.data   || [];

      setRows([
        {
          sn: "१", name: "अन्तर प्रदेशीय रुट इजाजतपत्र",
          naya:      sumField(rpList, "naya"),
          nabikaran: sumField(rpList, "nabikaran"),
        },
        {
          sn: "२", name: "सवारी जाँचपास",
          naya:      sumField(fitList, "naya"),
          nabikaran: sumField(fitList, "nabikaran"),
        },
        {
          sn: "३", name: "पटके",
          naya:      sumField(patList, "count"),
          nabikaran: 0,
        },
        {
          sn: "४", name: "यान्त्रिक परीक्षण (Vehicle Fitness Test Center)",
          naya:      sumField(mechList, "count"),
          nabikaran: 0,
        },
        {
          sn: "५", name: "प्रदुषण जाँचपास",
          naya:      sumField(polList, "pass") + sumField(polList, "fail"), // (pass+fail) in नयाँ
          nabikaran: 0,
        },
        {
          sn: "६", name: "Road Worthiness Test",
          naya:      0,
          nabikaran: sumField(rwList, "roadworthiness_test_done"),
        },
        {
          sn: "७", name: "यातायात सेवा पञ्जीकरण संख्या",
          naya:      sumField(trList, "naya") + sumField(trList, "thap"), // (thap+new) in नयाँ
          nabikaran: sumField(trList, "nabikaran"),
        },
        {
          sn: "८", name: "स्तर कायम",
          naya:      sumField(starList, "count"),
          nabikaran: 0,
        },
        {
          sn: "९", name: "कारखाना वर्कसप / सवारी परीक्षण केन्द्रमा अनुगमन",
          naya:      sumField(monList, "naya"),
          nabikaran: sumField(monList, "nabikaran"),
        },
      ]);
    } catch (err) {
      setFetchError(err.message || "डाटा ल्याउन समस्या भयो।");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch whenever modal opens
  useEffect(() => {
    let active = true;
    if (isOpen) {
      void (async () => {
        if (active) {
          await fetchAllData();
        }
      })();
    }
    return () => {
      active = false;
    };
  }, [isOpen, fetchAllData]);

  // ── inline cell edit ─────────────────────────────────────────
  const updateRow = (idx, field, value) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: isNaN(Number(value)) ? value : Number(value) } : r))
    );
  };

  // ── computed totals ───────────────────────────────────────────
  const totalNaya      = rows.reduce((s, r) => s + (r.naya || 0), 0);
  const totalNabikaran = rows.reduce((s, r) => s + (r.nabikaran || 0), 0);
  const grandTotal     = totalNaya + totalNabikaran;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Modal Header ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Pencil className="w-4 h-4 text-blue-600" />
              आधिकारिक पत्र प्रिव्यु (Official Letter Preview)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              सबै सेल सिधै क्लिक गरेर सम्पादन गर्न सकिन्छ ।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllData}
              disabled={loading}
              title="API बाट पुन: डाटा ल्याउनुहोस्"
              className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Fetch error banner ── */}
        {fetchError && (
          <div className="mx-6 mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            ⚠ {fetchError}
          </div>
        )}

        {/* ── Document Preview ── */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-zinc-950 flex justify-center">
          <div
            id="printable-letter"
            className="bg-white text-slate-900 shadow-md w-full max-w-[21cm] min-h-[29.7cm] border border-slate-200 rounded-md"
            style={{ fontFamily: "'Mangal', 'Noto Serif Devanagari', serif", fontSize: "13px" }}
          >

            {/* ═══════════════════════════════════════
                LETTERHEAD IMAGE
            ═══════════════════════════════════════ */}
            <div className="letterhead-img-wrapper relative w-full" style={{ height: "175px" }}>
              <Image
                src="/letterhead.png"
                alt="Official Letterhead — सवारी परीक्षण कार्यालय"
                fill
                sizes="(max-width: 800px) 100vw, 794px"
                className="object-contain object-top"
                priority
              />
            </div>

            {/* ═══════════════════════════════════════
                BELOW LETTERHEAD — मिति (Right side)
            ═══════════════════════════════════════ */}
            <div className="px-10 pt-2 pb-2 flex justify-end items-center">
              <div className="text-xs text-right text-slate-700 space-y-1">
                <div className="flex items-center gap-1 justify-end">
                  <span className="font-semibold">मिति:</span>
                  <input
                    type="text"
                    value={miti}
                    onChange={(e) => setMiti(e.target.value)}
                    className="border-b border-dashed border-slate-400 focus:border-blue-500 px-1 py-0 w-32 text-right bg-transparent outline-none font-semibold no-print-border"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════
                RECIPIENT
            ═══════════════════════════════════════ */}
            <div className="px-10 pt-1 pb-4 text-xs leading-loose text-slate-800">
              <div>श्री यातायात व्यवस्था विभाग,</div>
              <div>प्रशासन, योजना, अनुगमन तथा मूल्याङ्कन शाखा,</div>
              <div>मीनभवन, काठमाडौँ ।</div>
            </div>

            {/* ═══════════════════════════════════════
                SUBJECT
            ═══════════════════════════════════════ */}
            <div className="px-10 pb-3 text-xs font-bold text-slate-800 text-center">
              विषयः- विवरण उपलब्ध गराइएको सम्बन्धमा ।
            </div>

            {/* ═══════════════════════════════════════
                BODY TEXT
            ═══════════════════════════════════════ */}
            <div className="px-10 pb-4 text-xs leading-relaxed text-slate-800 text-justify">
              उपरोक्त सम्बन्धमा तहाँ विभागको पत्रानुसार माग भएबमोजिम यस कार्यालयको दैनिक
              प्रगति विवरण तपसिल बमोजिम रहेको ब्यहोरा आदेशानुसार अनुरोध छ ।
            </div>

            {/* ═══════════════════════════════════════
                तपसिल TABLE — fully editable
            ═══════════════════════════════════════ */}
            <div className="px-10 pb-8">
              <div className="font-bold text-xs mb-1 text-slate-800 flex items-center gap-2">
                <span>तपसिलः</span>
                {loading && (
                  <span className="text-[10px] text-blue-600 font-normal animate-pulse">
                    डाटा ल्याइँदैछ…
                  </span>
                )}
              </div>
              <table className="w-full border-collapse border border-slate-800 text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-800 py-1.5 px-2 text-center font-bold w-10" rowSpan={2}>
                      सि.नं.
                    </th>
                    <th className="border border-slate-800 py-1.5 px-2 text-center font-bold" rowSpan={2}>
                      क्रियाकलाप/विवरण (संख्या)
                    </th>
                    <th
                      className="border border-slate-800 py-1 px-2 text-center font-bold"
                      colSpan={3}
                    >
                      सवारी परीक्षण कार्यालय टेकु, मिति {miti} (दिउँसो १:३० सम्म)
                    </th>
                  </tr>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-800 py-1 px-3 text-center font-semibold w-20">नयाँ</th>
                    <th className="border border-slate-800 py-1 px-3 text-center font-semibold w-20">नवीकरण</th>
                    <th className="border border-slate-800 py-1 px-3 text-center font-semibold w-20">जम्मा</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.sn} className="border-b border-slate-700">
                      {/* SN */}
                      <td className="border border-slate-800 py-1 px-2 text-center text-slate-600 font-medium">
                        {row.sn}
                      </td>
                      {/* Activity name — editable */}
                      <td className="border border-slate-800 py-1 px-2 text-left">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateRow(idx, "name", e.target.value)}
                          className="w-full bg-transparent outline-none border-b border-dashed border-transparent hover:border-slate-300 focus:border-blue-400 text-slate-800 no-print-border transition-colors"
                          style={{ fontFamily: "inherit", fontSize: "inherit" }}
                        />
                      </td>
                      {/* नयाँ — editable */}
                      <td className="border border-slate-800 py-1 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          value={row.naya}
                          onChange={(e) => updateRow(idx, "naya", e.target.value)}
                          className="w-16 text-center bg-transparent outline-none border-b border-dashed border-transparent hover:border-slate-300 focus:border-blue-400 font-semibold text-slate-800 no-print-border transition-colors"
                          style={{ fontFamily: "inherit", fontSize: "inherit" }}
                        />
                      </td>
                      {/* नवीकरण — editable */}
                      <td className="border border-slate-800 py-1 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          value={row.nabikaran}
                          onChange={(e) => updateRow(idx, "nabikaran", e.target.value)}
                          className="w-16 text-center bg-transparent outline-none border-b border-dashed border-transparent hover:border-slate-300 focus:border-blue-400 font-semibold text-slate-800 no-print-border transition-colors"
                          style={{ fontFamily: "inherit", fontSize: "inherit" }}
                        />
                      </td>
                      {/* जम्मा — computed */}
                      <td className="border border-slate-800 py-1 px-2 text-center font-bold text-slate-900 bg-slate-50/30">
                        {(row.naya || 0) + (row.nabikaran || 0)}
                      </td>
                    </tr>
                  ))}

                  {/* Totals row */}
                  <tr className="bg-slate-100 font-bold">
                    <td className="border border-slate-800 py-1.5 px-2" />
                    <td className="border border-slate-800 py-1.5 px-2 text-left text-slate-900">जम्मा</td>
                    <td className="border border-slate-800 py-1.5 px-2 text-center text-slate-900">{totalNaya}</td>
                    <td className="border border-slate-800 py-1.5 px-2 text-center text-slate-900">{totalNabikaran}</td>
                    <td className="border border-slate-800 py-1.5 px-2 text-center text-blue-900 font-black">{grandTotal}</td>
                  </tr>
                </tbody>
              </table>

              {/* Edit hint */}
              <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 no-print">
                <Pencil className="w-3 h-3" />
                जुनसुकै सेलमा क्लिक गरेर मान परिवर्तन गर्नुहोस् — प्रिन्टमा border देखिँदैन।
              </p>
            </div>

            {/* ═══════════════════════════════════════
                SIGNATURE
            ═══════════════════════════════════════ */}
            <div className="px-10 pb-10 flex flex-col items-end">
              <div className="h-12 w-40" />
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="border-b border-dashed border-slate-400 focus:border-blue-500 px-1 py-0.5 w-44 text-center font-bold text-slate-800 bg-transparent outline-none text-xs no-print-border"
                style={{ fontFamily: "inherit" }}
              />
              <input
                type="text"
                value={signerDesignation}
                onChange={(e) => setSignerDesignation(e.target.value)}
                className="border-b border-dashed border-slate-300 focus:border-blue-400 px-1 py-0.5 w-44 text-center text-slate-500 bg-transparent outline-none text-[11px] mt-0.5 no-print-border"
                style={{ fontFamily: "inherit" }}
              />
            </div>

          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-between items-center gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            onClick={fetchAllData}
            disabled={loading}
            className="text-xs md:text-sm border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            API बाट पुन: ल्याउनुहोस्
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs md:text-sm border-slate-200 dark:border-zinc-800 dark:text-zinc-300"
            >
              रद्द गर्नुहोस् (Cancel)
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg flex items-center gap-1.5 shadow-sm text-xs md:text-sm font-semibold"
            >
              <Printer className="w-4 h-4 shrink-0" />
              प्रिन्ट गर्नुहोस् (Print Letter)
            </Button>
          </div>
        </div>
      </div>

      {/* ── Print styles ── */}
      <style jsx global>{`
        @media print {
          body > *:not(#__next) { display: none !important; }
          #printable-letter { display: block !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
          .no-print-border { border: none !important; }
        }
      `}</style>
    </div>
  );
}
