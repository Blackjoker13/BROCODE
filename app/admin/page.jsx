"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Package,
  Clock,
  Plus,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { safeJsonParse } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-400 font-mono text-xs">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          <span>LOADING STORE COMMAND METRICS...</span>
        </div>
      </div>
    );
  }

  const {
    metrics = { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, lowStockCount: 0, avgOrderValue: "0.00" },
    charts = {},
    topProducts = [],
    recentOrders = [],
  } = data || {};

  const revenue7Days = charts?.revenue7Days || data?.last7Days || [];
  const ordersByStatus = charts?.ordersByStatus || data?.ordersByStatus || [];
  const activityLogs = data?.activityLogs || data?.recentLogs || [];

  return (
    <div className="space-y-8">
      {/* ============ WELCOME & QUICK ACTIONS ============ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Dashboard Overview
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Real-time telemetry, store metrics, and inventory status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/banners"
            className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 font-mono text-xs font-bold text-neutral-200 transition-all hover:bg-neutral-800"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Manage CMS</span>
          </Link>
        </div>
      </div>

      {/* ============ 4 STAT KPI CARDS ============ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Total Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-black text-white">
            ${metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+18.4% from last month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Orders Processed
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-black text-white">
            {metrics.totalOrders}
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
            <span>Avg Value: <strong className="text-white">${metrics.avgOrderValue}</strong></span>
          </div>
        </div>

        {/* Customers */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Customer Accounts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-black text-white">
            {metrics.totalCustomers}
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-purple-400">
            <span>100% active retention</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Low Stock Alerts
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
              metrics.lowStockCount > 0
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className={`mt-3 font-heading text-3xl font-black ${
            metrics.lowStockCount > 0 ? "text-red-400" : "text-emerald-400"
          }`}>
            {metrics.lowStockCount}
          </div>
          <div className="mt-2 font-mono text-[11px] text-neutral-400">
            <Link href="/admin/inventory" className="text-amber-400 hover:underline">
              Inspect inventory →
            </Link>
          </div>
        </div>
      </div>

      {/* ============ CHARTS SECTION ============ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 7-Day Revenue Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wide text-white">
                Revenue Trajectory (Last 7 Days)
              </h2>
              <p className="font-mono text-[11px] text-neutral-500">
                Daily sales performance in USD
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-amber-400">
              Live Feed
            </span>
          </div>

          {/* Clean Bar Visualization */}
          <div className="mt-6 flex h-48 items-end gap-3 sm:gap-6 pt-4">
            {revenue7Days.length === 0 ? (
              <div className="flex w-full h-full items-center justify-center font-mono text-xs text-neutral-500">
                NO REVENUE DATA YET
              </div>
            ) : (
              revenue7Days.map((item, idx) => {
                const maxRev = Math.max(...revenue7Days.map((d) => d.revenue || 0), 100);
                const heightPercent = Math.max(12, Math.round(((item.revenue || 0) / maxRev) * 100));

                return (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <div className="font-mono text-[10px] font-bold text-neutral-400">
                      ${item.revenue || 0}
                    </div>
                    <div className="relative w-full rounded-t-lg bg-neutral-800/80 overflow-hidden flex items-end h-32">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-500 hover:brightness-110"
                      />
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {item.day}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl">
          <div className="border-b border-neutral-800/80 pb-4">
            <h2 className="font-heading text-base font-bold uppercase tracking-wide text-white">
              Order Status Breakdown
            </h2>
            <p className="font-mono text-[11px] text-neutral-500">
              Active fulfillment pipeline
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {ordersByStatus.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-neutral-500">
                NO ACTIVE ORDERS
              </div>
            ) : (
              ordersByStatus.map((st, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-neutral-950/60 p-3 border border-neutral-800/60">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: st.color || "#eab308" }}
                    />
                    <span className="font-mono text-xs text-neutral-300">
                      {st.status}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-white">
                    {st.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ============ RECENT ORDERS & TOP PRODUCTS ============ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <h2 className="font-heading text-base font-bold uppercase tracking-wide text-white">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 font-mono text-xs text-amber-400 hover:underline"
            >
              <span>View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500">
                  <th className="pb-3 font-bold">ORDER #</th>
                  <th className="pb-3 font-bold">CUSTOMER</th>
                  <th className="pb-3 font-bold">STATUS</th>
                  <th className="pb-3 font-bold text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 font-bold text-amber-400">
                      <Link href={`/admin/orders`}>{o.orderNumber}</Link>
                    </td>
                    <td className="py-3 text-neutral-300">{o.customerName}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        o.orderStatus === "DELIVERED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : o.orderStatus === "SHIPPED"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : o.orderStatus === "PROCESSING"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-white">
                      ${o.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl">
          <div className="border-b border-neutral-800/80 pb-4">
            <h2 className="font-heading text-base font-bold uppercase tracking-wide text-white">
              Top Catalog Items
            </h2>
            <p className="font-mono text-[11px] text-neutral-500">
              High-demand apparel & gear
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {topProducts.map((p) => {
              const images = safeJsonParse(p.images, []);
              return (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-neutral-950/40 p-2.5 border border-neutral-800/50">
                  <img
                    src={images[0] || "/images/sabaton_tee.jpg"}
                    alt={p.title}
                    className="h-10 w-10 rounded-lg object-cover bg-neutral-900 border border-neutral-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-xs font-bold text-neutral-200">
                      {p.title}
                    </div>
                    <div className="font-mono text-[10px] text-neutral-400">
                      Stock: <span className="text-white font-bold">{p.stock}</span> units
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-400">
                    ${p.price}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
