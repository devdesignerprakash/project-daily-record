"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { PlusCircle, Calendar, Factory, Pencil } from "lucide-react";
import api from "@/lib/api";
import { formatTime } from "@/lib/utils";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function MonitoringTab({ records, isAdmin, onSuccess, onError }) {
  const [form, setForm] = useState({ naya: "", nabikaran: "", date: todayStr() });
  const [editingId, setEditingId] = useState(null);

  const startEdit = (row) => {
    setEditingId(row._id);
    setForm({ naya: String(row.naya ?? ""), nabikaran: String(row.nabikaran ?? ""), date: todayStr() });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ naya: "", nabikaran: "", date: todayStr() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.naya && !form.nabikaran) {
      onError("नयाँ वा नवीकरण संख्या मध्ये कम्तिमा एउटा अनिवार्य छ।");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/api/monitoring/${editingId}`, form);
        onSuccess("अनुगमन डाटा सफलतापूर्वक सम्पादन भयो!");
      } else {
        await api.post("/api/monitoring", form);
        onSuccess("अनुगमन डाटा सफलतापूर्वक रेकर्ड भयो!");
      }
      setEditingId(null);
      setForm({ naya: "", nabikaran: "", date: todayStr() });
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Entry Form */}
      <Card className="lg:col-span-1 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            {editingId ? <Pencil className="w-4 h-4 text-amber-600" /> : <PlusCircle className="w-4 h-4 text-cyan-600" />}
            {editingId ? "प्रविष्टि सम्पादन (Edit Entry)" : "नयाँ प्रविष्टि (New Entry)"}
          </CardTitle>
          <CardDescription className="text-xs">
            {editingId ? "छानिएको रेकर्ड सम्पादन गरी पुन: सबमिट गर्नुहोस्" : "कारखाना वर्कसप / सवारी परीक्षण केन्द्रको अनुगमन दर्ता गर्नुहोस्"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isAdmin && !editingId && (
              <div className="space-y-2">
                <Label htmlFor="mon-date" className="text-xs font-semibold">
                  मिति (Date) — पुरानो मितिको लागि परिवर्तन गर्न सकिन्छ
                </Label>
                <Input
                  id="mon-date"
                  type="date"
                  max={todayStr()}
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="mon-naya" className="text-xs font-semibold">
                नयाँ (New)
              </Label>
              <Input
                id="mon-naya"
                type="number"
                min="0"
                value={form.naya}
                onChange={(e) => setForm({ ...form, naya: e.target.value })}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
                placeholder="नयाँ संख्या"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mon-nabikaran" className="text-xs font-semibold">
                नवीकरण (Renewal)
              </Label>
              <Input
                id="mon-nabikaran"
                type="number"
                min="0"
                value={form.nabikaran}
                onChange={(e) => setForm({ ...form, nabikaran: e.target.value })}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
                placeholder="नवीकरण संख्या"
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                className="border-slate-200 dark:border-zinc-800 text-sm"
              >
                रद्द (Cancel)
              </Button>
            )}
            <Button
              type="submit"
              className={`flex-1 text-white rounded-md text-sm ${editingId ? "bg-amber-600 hover:bg-amber-500" : "bg-cyan-700 hover:bg-cyan-600"}`}
            >
              {editingId ? "अपडेट गर्नुहोस् (Update)" : "सबमिट गर्नुहोस् (Submit)"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Today's Records Table */}
      <Card className="lg:col-span-2 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-600" />
            आजका विवरणहरू (Today&apos;s Records)
          </CardTitle>
          <CardDescription className="text-xs">
            आज दाखिला भएका अनुगमन विवरण
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
              <TableRow>
                <TableHead className="text-xs">समय (Time)</TableHead>
                <TableHead className="text-xs">नयाँ</TableHead>
                <TableHead className="text-xs">नवीकरण</TableHead>
                <TableHead className="text-xs">जम्मा</TableHead>
                <TableHead className="text-xs">दर्ता गर्ने</TableHead>
                <TableHead className="text-xs text-right">सम्पादन</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-slate-400 py-8 text-xs"
                  >
                    आज कुनै रेकर्ड प्रविष्ट गरिएको छैन।
                  </TableCell>
                </TableRow>
              ) : (
                records.map((row) => (
                  <TableRow
                    key={row._id}
                    className={`border-b border-slate-100 dark:border-zinc-900 text-xs ${editingId === row._id ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}
                  >
                    <TableCell className="font-semibold text-slate-500">
                      {formatTime(row.createdAt)}
                    </TableCell>
                    <TableCell>{row.naya || 0}</TableCell>
                    <TableCell>{row.nabikaran || 0}</TableCell>
                    <TableCell className="font-bold text-cyan-900 dark:text-cyan-400">
                      {(row.naya || 0) + (row.nabikaran || 0)}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {row.createdBy?.fullName || "System"}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        title="सम्पादन गर्नुहोस्"
                        className="p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
