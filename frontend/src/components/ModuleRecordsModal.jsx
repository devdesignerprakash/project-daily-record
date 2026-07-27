"use client";

import { useState, useCallback, useEffect } from "react";
import { X, CalendarSearch, RefreshCw, ListFilter } from "lucide-react";
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
import { formatDate, formatTime } from "@/lib/utils";
import { MODULE_RECORDS_CONFIG } from "@/lib/moduleRecordsConfig";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function ModuleRecordsModal({ moduleKey, onClose }) {
  const config = moduleKey ? MODULE_RECORDS_CONFIG[moduleKey] : null;

  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate]     = useState(todayStr());
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const fetchRecords = useCallback(async (from, to) => {
    if (!config) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`${config.apiPath}/by-date-range`, {
        params: { startDate: from, endDate: to },
      });
      setRecords(res.data || []);
    } catch (err) {
      setError(err.message || "विवरण ल्याउन समस्या भयो।");
      setRecords([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey]);

  // Parent remounts this component (via `key={moduleKey}`) whenever a
  // different KPI is opened, so fromDate/toDate always start fresh at today.
  useEffect(() => {
    let active = true;
    if (moduleKey) {
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
  }, [moduleKey]);

  if (!moduleKey || !config) return null;

  const total = records.reduce((sum, r) => sum + config.columns.reduce((s, c) => s + (Number(r[c.field]) || 0), 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-blue-600" />
              {config.label} — विवरण सूची
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              मिति सीमा छानेर सम्बन्धित रेकर्डहरू हेर्नुहोस्।
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
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-md text-sm flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CalendarSearch className="w-4 h-4" />}
            हेर्नुहोस् (View)
          </Button>
          <span className="text-xs text-slate-500 sm:ml-auto">
            जम्मा रेकर्ड: <strong>{records.length}</strong> · जम्मा संख्या: <strong>{total}</strong>
          </span>
        </div>

        {/* ── Body ── */}
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
                  <TableHead className="text-xs">मिति (Date)</TableHead>
                  <TableHead className="text-xs">समय (Time)</TableHead>
                  {config.columns.map((col) => (
                    <TableHead key={col.field} className="text-xs">{col.label}</TableHead>
                  ))}
                  <TableHead className="text-xs">दर्ता गर्ने</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={config.columns.length + 3} className="text-center text-slate-400 py-8 text-xs">
                      {loading ? "लोड हुँदैछ..." : "यस मिति सीमामा कुनै रेकर्ड छैन।"}
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((row) => (
                    <TableRow key={row._id} className="border-b border-slate-100 dark:border-zinc-900 text-xs">
                      <TableCell className="font-semibold text-slate-500">{formatDate(row.createdAt)}</TableCell>
                      <TableCell className="font-semibold text-slate-500">{formatTime(row.createdAt)}</TableCell>
                      {config.columns.map((col) => (
                        <TableCell key={col.field} className="font-semibold text-slate-800 dark:text-zinc-200">
                          {row[col.field] ?? 0}
                        </TableCell>
                      ))}
                      <TableCell className="text-slate-500">{row.createdBy?.fullName || "System"}</TableCell>
                    </TableRow>
                  ))
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
