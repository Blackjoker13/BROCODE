"use client";

import { useState, useEffect } from "react";
import { FolderTree, Plus, Edit2, Trash2, Upload, X, Check, AlertCircle } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "/images/pallet_rack.jpg",
    actionText: "",
    isFeatured: false,
    order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "/images/pallet_rack.jpg",
      actionText: "",
      isFeatured: false,
      order: categories.length + 1,
    });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      image: cat.image || "/images/pallet_rack.jpg",
      actionText: cat.actionText || "",
      isFeatured: cat.isFeatured,
      order: cat.order || 0,
    });
    setError("");
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      if (data.category) {
        setCategories((prev) => {
          const exists = prev.some((c) => c.id === data.category.id);
          if (exists) {
            return prev.map((c) => (c.id === data.category.id ? data.category : c));
          }
          return [data.category, ...prev];
        });
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Category Directory ({categories.length})
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Manage storefront navigation, circular banner cards, and catalogs
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="group relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-xl transition-all hover:border-neutral-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={c.image || "/images/pallet_rack.jpg"}
                  alt={c.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-neutral-800"
                />
                <div>
                  <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                    {c.name}
                  </h3>
                  <span className="font-mono text-[11px] text-amber-400 font-bold">
                    [{c.itemCount} items]
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(c)}
                  className="rounded-lg border border-neutral-800 p-1.5 text-neutral-400 hover:border-amber-500 hover:text-amber-300"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="rounded-lg border border-neutral-800 p-1.5 text-neutral-400 hover:border-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral-400 font-sans line-clamp-2">
              {c.description || "No description provided."}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-neutral-800/60 pt-3 font-mono text-[11px] text-neutral-500">
              <span>Slug: /{c.slug}</span>
              {c.actionText && (
                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-400 font-bold">
                  {c.actionText}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-white">
                {editingCategory ? "Edit Category" : "New Category"}
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

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-sans text-xs">
              <div>
                <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                  CATEGORY NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. BANDS, ACCESORIOS, ROPA"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                  BUTTON ACTION TEXT
                </label>
                <input
                  type="text"
                  value={formData.actionText}
                  onChange={(e) => setFormData({ ...formData, actionText: e.target.value })}
                  placeholder="e.g. SHOP BANDS"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                  CATEGORY IMAGE
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="preview"
                    className="h-12 w-12 rounded-full object-cover border border-neutral-800"
                  />
                  <label className="cursor-pointer rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-300 hover:border-amber-500">
                    <span>{uploading ? "Uploading..." : "Upload New Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short category summary..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-neutral-800 px-4 py-2 text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 font-mono text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>{saving ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
