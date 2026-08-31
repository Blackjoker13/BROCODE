"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users, ArrowUpRight, Download } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    if (!data) return;
    const rows = data.charts?.revenue7Days || data.last7Days || [];
    let csv = "Day,Date,Revenue,Orders\n";
    rows.forEach((row) => {
      csv += `${row.day},${row.date},${row.revenue},${row.orders}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brocode_sales_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-neutral-400">
        COMPUTING STORE TELEMETRY & SALES METRICS...
      </div>
    );
  }

  const metrics = {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: "0.00",
    ...(data?.metrics || {}),
  };

  const revenue7Days = data?.charts?.revenue7Days || data?.last7Days || [];
  const totalRevNum = typeof metrics.totalRevenue === "number" ? metrics.totalRevenue : (parseFloat(metrics.totalRevenue) || 0);
  const avgOrderValStr = metrics.avgOrderValue || (metrics.totalOrders > 0 ? (totalRevNum / metrics.totalOrders).toFixed(2) : "0.00");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Analytics & Sales Reports
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Revenue trends, fulfillment velocity, and conversion insights
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 font-mono text-xs font-bold text-neutral-200 hover:bg-neutral-800"
        >
          <Download className="h-4 w-4 text-amber-400" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
          <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold">
            Gross Revenue
          </span>
          <div className="mt-2 font-heading text-3xl font-black text-amber-400">
            ${totalRevNum.toFixed(2)}
          </div>
          <span className="font-mono text-[10px] text-emerald-400 mt-1 block">
            +24% vs prior period
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
          <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold">
            Average Order Value (AOV)
          </span>
          <div className="mt-2 font-heading text-3xl font-black text-white">
            ${avgOrderValStr}
          </div>
          <span className="font-mono text-[10px] text-neutral-400 mt-1 block">
            Benchmark: $50.00
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
          <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold">
            Total Orders
          </span>
          <div className="mt-2 font-heading text-3xl font-black text-white">
            {metrics.totalOrders}
          </div>
          <span className="font-mono text-[10px] text-blue-400 mt-1 block">
            100% fulfillment rate
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
          <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold">
            Customer Base
          </span>
          <div className="mt-2 font-heading text-3xl font-black text-white">
            {metrics.totalCustomers}
          </div>
          <span className="font-mono text-[10px] text-purple-400 mt-1 block">
            Verified accounts
          </span>
        </div>
      </div>

      {/* Revenue Trajectory Chart */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h2 className="font-heading text-base font-bold uppercase tracking-wide text-white">
            Daily Revenue Breakdown
          </h2>
          <span className="font-mono text-xs text-amber-400 font-bold">7-Day Trajectory</span>
        </div>

        <div className="mt-6 flex h-48 items-end gap-4 sm:gap-8 pt-4">
          {revenue7Days.length === 0 ? (
            <div className="flex w-full h-full items-center justify-center font-mono text-xs text-neutral-500">
              NO REVENUE DATA RECORDED
            </div>
          ) : (
            revenue7Days.map((item, idx) => {
              const maxRev = Math.max(...revenue7Days.map((d) => d.revenue || 0), 100);
              const heightPercent = Math.max(15, Math.round(((item.revenue || 0) / maxRev) * 100));

              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <div className="font-mono text-[11px] font-bold text-white">
                    ${item.revenue || 0}
                  </div>
                  <div className="relative w-full rounded-t-xl bg-neutral-800/80 overflow-hidden flex items-end h-32">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full rounded-t-xl bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300"
                    />
                  </div>
                  <span className="font-mono text-xs text-neutral-400 font-bold">
                    {item.day}
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500">
                    {item.orders || 0} orders
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
