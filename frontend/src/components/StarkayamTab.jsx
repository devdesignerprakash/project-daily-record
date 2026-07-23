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
import { PlusCircle, Calendar, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import { formatTime } from "@/lib/utils";

export default function StarkayamTab({ records, onSuccess, onError }) {
  const [form, setForm] = useState({ naya: "", nabikaran: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.naya || !form.nabikaran) {
      onError("नयाँ र नवीकरण संख्या अनिवार्य छ।");
      return;
    }
    try {
      await api.post("/api/starkayam", form);
      onSuccess("स्तर कायम डाटा सफलतापूर्वक रेकर्ड भयो!");
      setForm({ naya: "", nabikaran: "" });
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
            <PlusCircle className="w-4 h-4 text-teal-600" />
            नयाँ प्रविष्टि (New Entry)
          </CardTitle>
          <CardDescription className="text-xs">
            दैनिक स्तर कायम संख्या दर्ता गर्नुहोस्
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="starkayam-naya" className="text-xs font-semibold">
                नयाँ (New Count)
              </Label>
              <Input
                id="starkayam-naya"
                type="number"
                min="0"
                required
                value={form.naya}
                onChange={(e) => setForm({ ...form, naya: e.target.value })}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="starkayam-nabikaran" className="text-xs font-semibold">
                नवीकरण (Renewal Count)
              </Label>
              <Input
                id="starkayam-nabikaran"
                type="number"
                min="0"
                required
                value={form.nabikaran}
                onChange={(e) => setForm({ ...form, nabikaran: e.target.value })}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-teal-700 hover:bg-teal-600 text-white rounded-md text-sm"
            >
              सबमिट गर्नुहोस् (Submit)
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Today's Records Table */}
      <Card className="lg:col-span-2 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            आजका विवरणहरू (Today&apos;s Records)
          </CardTitle>
          <CardDescription className="text-xs">
            आज दाखिला भएका स्तर कायम विवरण
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
              <TableRow>
                <TableHead className="text-xs">समय (Time)</TableHead>
                <TableHead className="text-xs">नयाँ</TableHead>
                <TableHead className="text-xs">नवीकरण</TableHead>
                <TableHead className="text-xs">दर्ता गर्ने</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-slate-400 py-8 text-xs"
                  >
                    आज कुनै रेकर्ड प्रविष्ट गरिएको छैन।
                  </TableCell>
                </TableRow>
              ) : (
                records.map((row) => (
                  <TableRow
                    key={row._id}
                    className="border-b border-slate-100 dark:border-zinc-900 text-xs"
                  >
                    <TableCell className="font-semibold text-slate-500">
                      {formatTime(row.createdAt)}
                    </TableCell>
                    <TableCell className="font-bold text-teal-900 dark:text-teal-400">
                      {row.naya}
                    </TableCell>
                    <TableCell className="font-bold text-teal-900 dark:text-teal-400">
                      {row.nabikaran}
                    </TableCell>
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
    </div>
  );
}
