"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, Trash2, CheckCircle, Percent, DollarSign, Truck, X, Check, AlertCircle } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrderValue: 40,
    maxDiscount: "",
    usageLimit: 200,
  });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      alert("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) fetchCoupons();
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Offers & Coupons ({coupons.length})
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Promotional codes, percentage discounts, and free shipping triggers
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              code: "",
              description: "",
              discountType: "PERCENTAGE",
              discountValue: 10,
              minOrderValue: 30,
              maxDiscount: "",
              usageLimit: 500,
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Coupons Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="relative rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {c.discountType === "PERCENTAGE" ? (
                    <Percent className="h-5 w-5" />
                  ) : c.discountType === "FIXED" ? (
                    <DollarSign className="h-5 w-5" />
                  ) : (
                    <Truck className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="font-mono text-base font-black text-amber-400 tracking-wider">
                    {c.code}
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400 uppercase">
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}% OFF`
                      : c.discountType === "FIXED"
                      ? `$${c.discountValue} OFF`
                      : "FREE SHIPPING"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCoupon(c.id, c.code)}
                className="rounded-lg border border-neutral-800 p-1.5 text-neutral-500 hover:border-red-500 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-neutral-300 font-sans">
              {c.description || "Active promotional campaign."}
            </p>

            <div className="mt-4 space-y-1 border-t border-neutral-800/60 pt-3 font-mono text-[11px] text-neutral-400">
              <div className="flex justify-between">
                <span>Min Order:</span>
                <span className="text-white font-bold">${c.minOrderValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Redemptions:</span>
                <span className="text-white font-bold">
                  {c.usageCount} / {c.usageLimit || "∞"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase text-white">
                Create Discount Code
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="mt-4 space-y-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  COUPON CODE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMERROCK25"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono uppercase focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    DISCOUNT TYPE
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    DISCOUNT VALUE *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="15"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    MIN ORDER ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    placeholder="30"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    USAGE LIMIT
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="500"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  DESCRIPTION
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Special concert tour promotional discount"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-neutral-800 px-4 py-2 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-amber-500 px-5 py-2 font-mono font-bold text-black hover:bg-amber-400"
                >
                  {saving ? "Saving..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
