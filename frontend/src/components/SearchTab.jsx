"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Search } from "lucide-react";
import api from "@/lib/api";
import { formatTime, formatDate } from "@/lib/utils";

const MODULE_OPTIONS = [
  { value: "fitness", label: "सवारी फिटनेस (Fitness)", endpoint: "fitness" },
  { value: "routePermit", label: "रुट इजाजत (Route Permit)", endpoint: "route-permit" },
  { value: "roadworthiness", label: "सडक योग्यता (Roadworthiness)", endpoint: "roadworthiness" },
  { value: "pollution", label: "प्रदुषण परीक्षण (Pollution Test)", endpoint: "pollution" },
];

export default function SearchTab({ onError }) {
  const [module, setModule] = useState("fitness");
  const [startTime, setStartTime] = useState("10:00:00");
  const [endTime, setEndTime] = useState("17:00:00");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const selectedModule = MODULE_OPTIONS.find((m) => m.value === module);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setSearched(false);
    try {
      const data = await api.get(
        `/api/${selectedModule.endpoint}/by-time-range`,
        { params: { startTime, endTime } }
      );
      setResults(data.data || []);
      setSearched(true);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isRoadworthiness = module === "roadworthiness";
  const isPollution = module === "pollution";

  return (
    <Card className="border border-slate-200 dark:border-zinc-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-600" />
          समय दायरा अनुसार खोज्नुहोस् (Search by Time Range)
        </CardTitle>
        <CardDescription className="text-xs">
          समय अन्तराल सेट गरी विभिन्न मोड्युलको दर्ताहरू खोज्नुहोस् (उदा: 10:00:00 देखि 17:00:00)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filter Row */}
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label htmlFor="search-module" className="text-xs font-semibold">
              मोड्युल (Module)
            </Label>
            <select
              id="search-module"
              value={module}
              onChange={(e) => { setModule(e.target.value); setResults([]); setSearched(false); }}
              className="w-full px-3 py-2 text-sm bg-transparent border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-zinc-900"
            >
              {MODULE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="dark:bg-zinc-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-start" className="text-xs font-semibold">
              शुरुको समय (Start Time)
            </Label>
            <Input
              id="search-start"
              type="text"
              placeholder="HH:MM:SS"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-end" className="text-xs font-semibold">
              अन्तिम समय (End Time)
            </Label>
            <Input
              id="search-end"
              type="text"
              placeholder="HH:MM:SS"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-md text-sm flex items-center justify-center gap-1"
          >
            <Search className="w-4 h-4" />
            {loading ? "खोज्दै..." : "डाटा खोज्नुहोस्"}
          </Button>
        </form>

        {/* Results Table */}
        {searched && (
          <div className="border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                <TableRow>
                  <TableHead className="text-xs">मिति (Date)</TableHead>
                  <TableHead className="text-xs">समय (Time)</TableHead>
                  {isRoadworthiness ? (
                    <TableHead className="text-xs">परिक्षण जम्मा</TableHead>
                  ) : isPollution ? (
                    <>
                      <TableHead className="text-xs">पास (Passed)</TableHead>
                      <TableHead className="text-xs">फेल (Failed)</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="text-xs">नयाँ</TableHead>
                      <TableHead className="text-xs">नवीकरण</TableHead>
                      <TableHead className="text-xs">प्रतिलिपि</TableHead>
                    </>
                  )}
                  <TableHead className="text-xs">दर्ता गर्ने</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isRoadworthiness ? 4 : isPollution ? 5 : 6}
                      className="text-center text-slate-400 py-8 text-xs"
                    >
                      छानिएको समय दायरामा कुनै डाटा फेला परेन।
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((row) => (
                    <TableRow
                      key={row._id}
                      className="border-b border-slate-100 dark:border-zinc-900 text-xs"
                    >
                      <TableCell>{formatDate(row.createdAt)}</TableCell>
                      <TableCell className="font-semibold text-slate-500">
                        {formatTime(row.createdAt)}
                      </TableCell>
                      {isRoadworthiness ? (
                        <TableCell className="font-bold text-purple-900 dark:text-purple-400">
                          {row.roadworthiness_test_done}
                        </TableCell>
                      ) : isPollution ? (
                        <>
                          <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">
                            {row.pass}
                          </TableCell>
                          <TableCell className="font-bold text-rose-600 dark:text-rose-400">
                            {row.fail}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{row.naya}</TableCell>
                          <TableCell>{row.nabikaran}</TableCell>
                          <TableCell>{row.pratilipi || 0}</TableCell>
                        </>
                      )}
                      <TableCell className="text-slate-500">
                        {row.createdBy?.fullName || "System"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
