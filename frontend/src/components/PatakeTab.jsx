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
import { PlusCircle, Calendar, Zap } from "lucide-react";
import api from "@/lib/api";
import { formatTime } from "@/lib/utils";

export default function PatakeTab({ records, onSuccess, onError }) {
  const [form, setForm] = useState({ count: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.count) {
      onError("पटके संख्या अनिवार्य छ।");
      return;
    }
    try {
      await api.post("/api/patake", form);
      onSuccess("पटके डाटा सफलतापूर्वक रेकर्ड भयो!");
      setForm({ count: "" });
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
            <PlusCircle className="w-4 h-4 text-rose-600" />
            नयाँ प्रविष्टि (New Entry)
          </CardTitle>
          <CardDescription className="text-xs">
            दैनिक पटके संख्या दर्ता गर्नुहोस्
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patake-count" className="text-xs font-semibold">
                पटके संख्या (Count)
              </Label>
              <Input
                id="patake-count"
                type="number"
                min="0"
                required
                value={form.count}
                onChange={(e) => setForm({ ...form, count: e.target.value })}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
                placeholder="संख्या प्रविष्ट गर्नुहोस्"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-rose-700 hover:bg-rose-600 text-white rounded-md text-sm"
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
            <Calendar className="w-4 h-4 text-rose-600" />
            आजका विवरणहरू (Today&apos;s Records)
          </CardTitle>
          <CardDescription className="text-xs">
            आज दाखिला भएका पटके विवरण
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
              <TableRow>
                <TableHead className="text-xs">समय (Time)</TableHead>
                <TableHead className="text-xs">पटके संख्या</TableHead>
                <TableHead className="text-xs">दर्ता गर्ने</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
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
                    <TableCell className="font-bold text-rose-900 dark:text-rose-400">
                      {row.count}
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
