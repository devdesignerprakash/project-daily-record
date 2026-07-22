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
import { PlusCircle, Calendar } from "lucide-react";
import api from "@/lib/api";
import { formatTime } from "@/lib/utils";

export default function RoadworthinessTab({ records, onSuccess, onError }) {
  const [count, setCount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!count) {
      onError("सडक योग्यता परीक्षा संख्या अनिवार्य छ।");
      return;
    }
    try {
      await api.post("/api/roadworthiness", {
        isroadwrothiss_test_done: count,
      });
      onSuccess("सडक योग्यता डाटा सफलतापूर्वक रेकर्ड भयो!");
      setCount("");
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
            <PlusCircle className="w-4 h-4 text-purple-600" />
            नयाँ प्रविष्टि (New Entry)
          </CardTitle>
          <CardDescription className="text-xs">
            दैनिक सडक योग्यता परीक्षा रेकर्ड गर्नुहोस्
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="road-count" className="text-xs font-semibold">
                सडक योग्यता परीक्षा संख्या (Count)
              </Label>
              <Input
                id="road-count"
                type="number"
                min="0"
                required
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-purple-900 hover:bg-purple-800 text-white rounded-md text-sm"
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
            <Calendar className="w-4 h-4 text-purple-600" />
            आजका विवरणहरू (Today&apos;s Records)
          </CardTitle>
          <CardDescription className="text-xs">
            आज दाखिला भएका दर्ता विवरण
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
              <TableRow>
                <TableHead className="text-xs">समय (Time)</TableHead>
                <TableHead className="text-xs">सडक योग्यता परीक्षा जम्मा</TableHead>
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
                    <TableCell className="font-bold text-purple-900 dark:text-purple-400">
                      {row.roadworthiness_test_done}
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
