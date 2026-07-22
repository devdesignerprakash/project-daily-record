"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Activity, MapPin, ClipboardList, Wind, Wrench, Zap, ShieldCheck, Factory, Bus } from "lucide-react";

export default function StatsGrid({ stats }) {
  return (
    <section className="space-y-4">
      {/* Row 1: Original 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fitness */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-blue-100 dark:bg-blue-950 rounded-lg text-blue-700 dark:text-blue-300">
            <Activity className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              सवारी फिटनेस (Fitness)
            </CardDescription>
            <CardTitle className="text-3xl font-black text-blue-900 dark:text-blue-400">
              {stats.fitness.total}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500 flex gap-4">
            <span>नयाँ: <strong>{stats.fitness.naya}</strong></span>
            <span>नवीकरण: <strong>{stats.fitness.nabikaran}</strong></span>
            <span>प्रतिलिपि: <strong>{stats.fitness.pratilipi}</strong></span>
          </CardContent>
        </Card>

        {/* Route Permit */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-emerald-100 dark:bg-emerald-950 rounded-lg text-emerald-700 dark:text-emerald-300">
            <MapPin className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              रुट इजाजत (Route Permit)
            </CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-900 dark:text-emerald-400">
              {stats.routePermit.total}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500 flex gap-4">
            <span>नयाँ: <strong>{stats.routePermit.naya}</strong></span>
            <span>नवीकरण: <strong>{stats.routePermit.nabikaran}</strong></span>
            <span>प्रतिलिपि: <strong>{stats.routePermit.pratilipi}</strong></span>
          </CardContent>
        </Card>

        {/* Roadworthiness */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-purple-100 dark:bg-purple-950 rounded-lg text-purple-700 dark:text-purple-300">
            <ClipboardList className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              सडक योग्यता (Roadworthiness)
            </CardDescription>
            <CardTitle className="text-3xl font-black text-purple-900 dark:text-purple-400">
              {stats.roadworthiness.total}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            <span>
              आज जम्मा परिक्षण गरिएको: <strong>{stats.roadworthiness.total}</strong>
            </span>
          </CardContent>
        </Card>

        {/* Pollution Test */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-amber-100 dark:bg-amber-950 rounded-lg text-amber-700 dark:text-amber-300">
            <Wind className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              प्रदुषण परीक्षण (Pollution Test)
            </CardDescription>
            <CardTitle className="text-3xl font-black text-amber-900 dark:text-amber-400">
              {stats.pollution ? stats.pollution.total : 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500 flex gap-4">
            <span>पास: <strong>{stats.pollution ? stats.pollution.pass : 0}</strong></span>
            <span>फेल: <strong>{stats.pollution ? stats.pollution.fail : 0}</strong></span>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: New 5 modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Mechanical Test */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-orange-100 dark:bg-orange-950 rounded-lg text-orange-700 dark:text-orange-300">
            <Wrench className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              यान्त्रिक परीक्षण
            </CardDescription>
            <CardTitle className="text-3xl font-black text-orange-900 dark:text-orange-400">
              {stats.mechanicalTest?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            <span>आज जम्मा: <strong>{stats.mechanicalTest?.total ?? 0}</strong></span>
          </CardContent>
        </Card>

        {/* Patake */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-rose-100 dark:bg-rose-950 rounded-lg text-rose-700 dark:text-rose-300">
            <Zap className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              पटके
            </CardDescription>
            <CardTitle className="text-3xl font-black text-rose-900 dark:text-rose-400">
              {stats.patake?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            <span>आज जम्मा: <strong>{stats.patake?.total ?? 0}</strong></span>
          </CardContent>
        </Card>

        {/* Starkayam */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-teal-100 dark:bg-teal-950 rounded-lg text-teal-700 dark:text-teal-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              स्तर कायम
            </CardDescription>
            <CardTitle className="text-3xl font-black text-teal-900 dark:text-teal-400">
              {stats.starkayam?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            <span>आज जम्मा: <strong>{stats.starkayam?.total ?? 0}</strong></span>
          </CardContent>
        </Card>

        {/* Monitoring */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-cyan-100 dark:bg-cyan-950 rounded-lg text-cyan-700 dark:text-cyan-300">
            <Factory className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              अनुगमन
            </CardDescription>
            <CardTitle className="text-3xl font-black text-cyan-900 dark:text-cyan-400">
              {stats.monitoring?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500 flex gap-3">
            <span>नयाँ: <strong>{stats.monitoring?.naya ?? 0}</strong></span>
            <span>नवी: <strong>{stats.monitoring?.nabikaran ?? 0}</strong></span>
          </CardContent>
        </Card>

        {/* Transport Registration */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="absolute top-2 right-2 p-2 bg-indigo-100 dark:bg-indigo-950 rounded-lg text-indigo-700 dark:text-indigo-300">
            <Bus className="w-5 h-5" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase">
              पञ्जीकरण
            </CardDescription>
            <CardTitle className="text-3xl font-black text-indigo-900 dark:text-indigo-400">
              {stats.transportRegistration?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500 flex gap-2 flex-wrap">
            <span>नयाँ: <strong>{stats.transportRegistration?.naya ?? 0}</strong></span>
            <span>नवी: <strong>{stats.transportRegistration?.nabikaran ?? 0}</strong></span>
            <span>थप: <strong>{stats.transportRegistration?.thap ?? 0}</strong></span>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
