"use client";

import { useState, useEffect } from "react";
import { Boxes, AlertTriangle, CheckCircle, Search, Save, RefreshCw, AlertCircle } from "lucide-react";
import { safeJsonParse } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalUnits: 0, lowStockCount: 0, outOfStockCount: 0 });
  const [filter, setFilter] = useState("all"); // all, low, out
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({}); // { [productId]: newStock }
  const [successMsg, setSuccessMsg] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await fetch(`/api/admin/inventory?filter=${filter}`);
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const handleStockChange = (id, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    setPendingChanges((prev) => ({ ...prev, [id]: num }));
  };

  const handleQuickAdjust = (id, currentStock, delta) => {
    const currentVal = pendingChanges[id] !== undefined ? pendingChanges[id] : currentStock;
    const newVal = Math.max(0, currentVal + delta);
    setPendingChanges((prev) => ({ ...prev, [id]: newVal }));
  };

  const handleSaveAll = async () => {
    const updates = Object.entries(pendingChanges).map(([id, stock]) => ({
      id,
      stock,
    }));

    if (updates.length === 0) return;

    setSaving(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        setPendingChanges({});
        setSuccessMsg(`Successfully updated stock for ${updates.length} item(s)!`);
        fetchInventory();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      alert("Failed to save inventory updates");
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((it) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return it.title.toLowerCase().includes(q) || (it.sku && it.sku.toLowerCase().includes(q));
  });

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Inventory & Stock Manager
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Real-time stock audit, threshold alerts, and batch adjustments
          </p>
        </div>

        {hasPendingChanges && (
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 font-mono text-xs font-bold text-black transition-all hover:bg-emerald-400 shadow-lg shadow-emerald-500/10 animate-bounce"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : `Save ${Object.keys(pendingChanges).length} Update(s)`}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
          <div className="font-mono text-[11px] font-bold text-neutral-400 uppercase">
            Total Units in Stock
          </div>
          <div className="mt-2 font-heading text-3xl font-black text-white">
            {stats.totalUnits}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
          <div className="font-mono text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Low Stock Items (≤5)</span>
          </div>
          <div className="mt-2 font-heading text-3xl font-black text-amber-400">
            {stats.lowStockCount}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
          <div className="font-mono text-[11px] font-bold text-red-400 uppercase flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Out of Stock (0)</span>
          </div>
          <div className="mt-2 font-heading text-3xl font-black text-red-400">
            {stats.outOfStockCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
              filter === "all"
                ? "bg-amber-500 text-black font-bold"
                : "bg-neutral-950 text-neutral-400 hover:text-white"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
              filter === "low"
                ? "bg-amber-500 text-black font-bold"
                : "bg-neutral-950 text-neutral-400 hover:text-white"
            }`}
          >
            Low Stock Only
          </button>
          <button
            onClick={() => setFilter("out")}
            className={`rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
              filter === "out"
                ? "bg-amber-500 text-black font-bold"
                : "bg-neutral-950 text-neutral-400 hover:text-white"
            }`}
          >
            Out of Stock
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-1.5 pl-9 pr-3 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Matrix Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400">
              <th className="py-3.5 px-4 font-bold">ITEM & SKU</th>
              <th className="py-3.5 px-4 font-bold">CATEGORY</th>
              <th className="py-3.5 px-4 font-bold">STATUS</th>
              <th className="py-3.5 px-4 font-bold">CURRENT STOCK</th>
              <th className="py-3.5 px-4 font-bold text-right">QUICK ADJUST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {filteredItems.map((it) => {
              const imgs = safeJsonParse(it.images, []);
              const currentVal =
                pendingChanges[it.id] !== undefined ? pendingChanges[it.id] : it.stock;
              const isModified = pendingChanges[it.id] !== undefined;

              return (
                <tr key={it.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={imgs[0] || "/images/sabaton_tee.jpg"}
                        alt={it.title}
                        className="h-10 w-10 rounded-xl object-cover border border-neutral-800 bg-neutral-950 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white font-sans text-xs line-clamp-1">
                          {it.title}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          SKU: {it.sku || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-neutral-400">
                    {it.category?.name || "General"}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        currentVal <= 0
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : currentVal <= 5
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{currentVal <= 0 ? "Out of Stock" : currentVal <= 5 ? "Low Stock" : "In Stock"}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={currentVal}
                        onChange={(e) => handleStockChange(it.id, e.target.value)}
                        className={`w-20 rounded-xl border p-1.5 text-center font-bold text-xs focus:outline-none ${
                          isModified
                            ? "border-amber-500 bg-amber-500/10 text-amber-300 ring-1 ring-amber-500"
                            : "border-neutral-800 bg-neutral-950 text-white"
                        }`}
                      />
                      {isModified && (
                        <span className="text-[10px] text-amber-400 font-bold">● Modified</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickAdjust(it.id, it.stock, -5)}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleQuickAdjust(it.id, it.stock, -1)}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleQuickAdjust(it.id, it.stock, +5)}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleQuickAdjust(it.id, it.stock, +20)}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500/20"
                      >
                        +20
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
