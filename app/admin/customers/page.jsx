"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Mail, Phone, ShoppingBag, DollarSign, X, Check, Eye } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  // Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`/api/admin/customers?search=${search}`);
      const data = await res.json();
      if (data.customers) setCustomers(data.customers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const viewCustomerDetails = async (c) => {
    try {
      const res = await fetch(`/api/admin/customers/${c.id}`);
      const data = await res.json();
      if (data.customer) {
        setSelectedCustomer(data.customer);
        setCustomerOrders(data.customer.orders || []);
      }
    } catch (e) {}
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchCustomers();
      }
    } catch (e) {
      alert("Failed to create customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Customer CRM ({customers.length})
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Accounts, order histories, lifetime value, and customer contact data
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ name: "", email: "", phone: "", notes: "" });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400">
              <th className="py-3.5 px-4 font-bold">CUSTOMER</th>
              <th className="py-3.5 px-4 font-bold">CONTACT</th>
              <th className="py-3.5 px-4 font-bold">ORDERS</th>
              <th className="py-3.5 px-4 font-bold">LIFETIME SPENT</th>
              <th className="py-3.5 px-4 font-bold">STATUS</th>
              <th className="py-3.5 px-4 font-bold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-800/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 font-bold text-amber-400 text-xs">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-sans font-bold text-white text-xs">{c.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        Joined {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="text-neutral-300">{c.email}</div>
                  <div className="text-[10px] text-neutral-500">{c.phone || "No phone"}</div>
                </td>

                <td className="py-3 px-4">
                  <span className="font-bold text-white">{c.totalOrders} order(s)</span>
                </td>

                <td className="py-3 px-4">
                  <span className="font-bold text-amber-400">${c.totalSpent.toFixed(2)}</span>
                </td>

                <td className="py-3 px-4">
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                    {c.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => viewCustomerDetails(c)}
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] font-bold text-neutral-300 hover:border-amber-500 hover:text-amber-300"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Profile</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-black font-bold">
                  {selectedCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-white">
                    {selectedCustomer.name}
                  </h2>
                  <span className="font-mono text-xs text-neutral-400">
                    {selectedCustomer.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                <span className="text-neutral-500">Total Lifetime Value:</span>
                <div className="mt-1 font-heading text-xl font-bold text-amber-400">
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                <span className="text-neutral-500">Total Orders Placed:</span>
                <div className="mt-1 font-heading text-xl font-bold text-white">
                  {selectedCustomer.totalOrders}
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="mt-4 border-t border-neutral-800 pt-3">
              <span className="font-mono text-[11px] font-bold text-neutral-400 uppercase">
                Order History ({customerOrders.length})
              </span>
              <div className="mt-2 max-h-48 overflow-y-auto space-y-2 font-mono text-xs">
                {customerOrders.length === 0 ? (
                  <p className="text-neutral-500 py-3 text-center">No orders recorded yet.</p>
                ) : (
                  customerOrders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/40 p-2.5"
                    >
                      <div>
                        <span className="font-bold text-amber-400">{o.orderNumber}</span>
                        <span className="text-[10px] text-neutral-500 ml-2">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">
                          {o.orderStatus}
                        </span>
                        <span className="font-bold text-white">${o.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase text-white">
                New Customer Account
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Gabriel Silva"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="gabriel@example.com"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  PHONE NUMBER
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+55 11 98765-4321"
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
                  {saving ? "Saving..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
