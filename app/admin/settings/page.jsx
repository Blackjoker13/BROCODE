"use client";

import { useState, useEffect } from "react";
import { Settings, Save, CheckCircle, Store, DollarSign, Truck, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    store_name: "BROCODE",
    store_email: "contact@brocode.store",
    currency_symbol: "₹",
    currency_code: "INR",
    tax_rate_percent: 5.0,
    free_shipping_threshold: 75.0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setSuccessMsg("Store configuration saved successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
          Store Settings & Configuration
        </h1>
        <p className="font-mono text-xs text-neutral-400">
          Global storefront rules, tax calculations, currency, and store metadata
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 font-sans text-xs">
        {/* Store Profile */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 font-heading text-base font-bold text-white uppercase border-b border-neutral-800 pb-3">
            <Store className="h-4 w-4 text-amber-400" />
            <span>Store Identity</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="store_name" className="block font-mono text-[10px] text-neutral-400 mb-1">
                STORE NAME
              </label>
              <input
                id="store_name"
                name="store_name"
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="store_email" className="block font-mono text-[10px] text-neutral-400 mb-1">
                CUSTOMER SUPPORT EMAIL
              </label>
              <input
                id="store_email"
                name="store_email"
                type="email"
                value={settings.store_email}
                onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 font-heading text-base font-bold text-white uppercase border-b border-neutral-800 pb-3">
            <DollarSign className="h-4 w-4 text-amber-400" />
            <span>Currency & Taxation</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="currency_symbol" className="block font-mono text-[10px] text-neutral-400 mb-1">
                CURRENCY SYMBOL
              </label>
              <input
                id="currency_symbol"
                name="currency_symbol"
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="currency_code" className="block font-mono text-[10px] text-neutral-400 mb-1">
                CURRENCY CODE (ISO)
              </label>
              <input
                id="currency_code"
                name="currency_code"
                type="text"
                value={settings.currency_code}
                onChange={(e) => setSettings({ ...settings, currency_code: e.target.value })}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono uppercase focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="tax_rate_percent" className="block font-mono text-[10px] text-neutral-400 mb-1">
                DEFAULT TAX RATE (%)
              </label>
              <input
                id="tax_rate_percent"
                name="tax_rate_percent"
                type="number"
                step="0.1"
                value={settings.tax_rate_percent}
                onChange={(e) =>
                  setSettings({ ...settings, tax_rate_percent: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Thresholds */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 font-heading text-base font-bold text-white uppercase border-b border-neutral-800 pb-3">
            <Truck className="h-4 w-4 text-amber-400" />
            <span>Shipping & Logistics Rules</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="free_shipping_threshold" className="block font-mono text-[10px] text-neutral-400 mb-1">
                FREE SHIPPING THRESHOLD ($)
              </label>
              <input
                id="free_shipping_threshold"
                name="free_shipping_threshold"
                type="number"
                step="1"
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    free_shipping_threshold: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-mono text-xs font-bold text-black hover:bg-amber-400 shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Configuration..." : "Save Store Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
