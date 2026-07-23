"use client";

import { useState, useCallback, useEffect } from "react";
import { X, CalendarSearch, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { formatTime } from "@/lib/utils";

// ── which modules to show, and which fields each one's rows carry ──
const MODULE_CONFIG = [
  { key: "fitness", label: "सवारी फिटनेस", columns: [
      { field: "naya", label: "नयाँ" },
      { field: "nabikaran", label: "नवीकरण" },
      { field: "pratilipi", label: "प्रतिलिपि" },
  ]},
  { key: "routePermit", label: "अन्तर प्रदेशीय रुट इजाजत", columns: [
      { field: "naya", label: "नयाँ" },
      { field: "nabikaran", label: "नवीकरण" },
      { field: "pratilipi", label: "प्रतिलिपि" },
  ]},
  { key: "roadworthiness", label: "सडक योग्यता (Road Worthiness)", columns: [
      { field: "roadworthiness_test_done", label: "परीक्षण सम्पन्न" },
  ]},
  { key: "pollution", label: "प्रदुषण जाँचपास", columns: [
      { field: "pass", label: "पास" },
      { field: "fail", label: "फेल" },
  ]},
  { key: "mechanicalTest", label: "यान्त्रिक परीक्षण", columns: [
      { field: "count", label: "संख्या" },
  ]},
  { key: "patake", label: "पटके", columns: [
      { field: "count", label: "संख्या" },
  ]},
  { key: "starkayam", label: "स्तर कायम", columns: [
      { field: "naya", label: "नयाँ" },
      { field: "nabikaran", label: "नवीकरण" },
  ]},
  { key: "monitoring", label: "कारखाना वर्कसप / सवारी परीक्षण केन्द्र अनुगमन", columns: [
      { field: "naya", label: "नयाँ" },
      { field: "nabikaran", label: "नवीकरण" },
  ]},
  { key: "transportRegistration", label: "यातायात सेवा पञ्जीकरण", columns: [
      { field: "naya", label: "नयाँ" },
      { field: "thap", label: "थप" },
      { field: "nabikaran", label: "नवीकरण" },
  ]},
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function AdminRecordsModal({ isOpen, onClose }) {
  const [date, setDate]       = useState(todayStr());
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const fetchRecords = useCallback(async (forDate) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/records-by-date", { params: { date: forDate } });
      setData(res.data || null);
    } catch (err) {
      setError(err.message || "विवरण ल्याउन समस्या भयो।");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (isOpen) {
      void (async () => {
        if (active) {
          await fetchRecords(date);
        }
      })();
    }
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              मिति अनुसार सबै विवरण (All Modules — By Date)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              कुनै पनि मितिको सबै मोड्युलहरूको दर्ता विवरण हेर्नुहोस्।
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Date picker ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">मिति छान्नुहोस् (Select Date)</label>
            <Input
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm bg-transparent border-slate-200 dark:border-zinc-800 w-full sm:w-56"
            />
          </div>
          <Button
            onClick={() => fetchRecords(date)}
            disabled={loading || !date}
            className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-sm flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CalendarSearch className="w-4 h-4" />}
            हेर्नुहोस् (View)
          </Button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-zinc-950 space-y-5">
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              ⚠ {error}
            </div>
          )}

          {MODULE_CONFIG.map((mod) => {
            const rows = data?.[mod.key] || [];
            return (
              <Card key={mod.key} className="border border-slate-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>{mod.label}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{rows.length} रेकर्ड</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                      <TableRow>
                        <TableHead className="text-xs">समय (Time)</TableHead>
                        {mod.columns.map((col) => (
                          <TableHead key={col.field} className="text-xs">{col.label}</TableHead>
                        ))}
                        <TableHead className="text-xs">दर्ता गर्ने</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={mod.columns.length + 2}
                            className="text-center text-slate-400 py-6 text-xs"
                          >
                            यस मितिमा कुनै रेकर्ड छैन।
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map((row) => (
                          <TableRow
                            key={row._id}
                            className="border-b border-slate-100 dark:border-zinc-900 text-xs"
                          >
                            <TableCell className="font-semibold text-slate-500">
                              {formatTime(row.createdAt)}
                            </TableCell>
                            {mod.columns.map((col) => (
                              <TableCell key={col.field} className="font-semibold text-slate-800 dark:text-zinc-200">
                                {row[col.field] ?? 0}
                              </TableCell>
                            ))}
                            <TableCell className="text-slate-500">
                              {row.createdBy?.fullName || "System"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
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
