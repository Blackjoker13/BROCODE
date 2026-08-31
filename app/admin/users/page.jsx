"use client";

import { useState, useEffect } from "react";
import { UserCog, Plus, Trash2, Shield, Mail, Key, X, Check, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.admins) setAdmins(data.admins);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");

      setModalOpen(false);
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (id, name) => {
    if (!confirm(`Delete admin account for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchAdmins();
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Admin Team & Access Control ({admins.length})
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Manage admin users, role-based privileges (Super Admin, Manager, Editor)
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ name: "", email: "", password: "", role: "ADMIN" });
            setError("");
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          <span>New Admin User</span>
        </button>
      </div>

      {/* Admin Users Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {admins.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700 font-bold text-amber-400 text-sm">
                  {a.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm font-sans">{a.name}</h3>
                  <span className="font-mono text-[10px] text-amber-400 font-bold">
                    {a.role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteAdmin(a.id, a.name)}
                className="rounded-lg border border-neutral-800 p-1.5 text-neutral-500 hover:border-red-500 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1 font-mono text-xs text-neutral-400 border-t border-neutral-800/60 pt-3">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{a.email}</span>
              </div>
              <div className="text-[10px] text-neutral-500">
                Created: {new Date(a.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase text-white">
                Add Admin Account
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="mt-4 space-y-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Miller"
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
                  placeholder="alex@brocode.store"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  ASSIGNED ROLE
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Store Access)</option>
                  <option value="ADMIN">ADMIN (Catalog & Orders)</option>
                  <option value="MANAGER">MANAGER (Orders & Inventory)</option>
                  <option value="EDITOR">EDITOR (CMS & Content Only)</option>
                </select>
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
                  {saving ? "Saving..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
