"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  AlertCircle,
  Tag,
  Sparkles,
} from "lucide-react";
import { safeJsonParse } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [stockStatus, setStockStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    compareAtPrice: "",
    costPerItem: "",
    sku: "",
    stock: 25,
    lowStockAlert: 5,
    categoryId: "",
    description: "",
    images: [],
    colors: ["#111111"],
    sizes: ["S", "M", "L", "XL"],
    badges: ["NEW"],
    tags: [],
    status: "ACTIVE",
    isFeatured: false,
    isNewArrival: true,
    isLimited: false,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCat !== "ALL") params.append("categoryId", selectedCat);
      if (stockStatus !== "ALL") params.append("stockStatus", stockStatus);
      if (sortBy) params.append("sort", sortBy);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, selectedCat, stockStatus, sortBy]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      price: "",
      compareAtPrice: "",
      costPerItem: "",
      sku: `BRO-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: 30,
      lowStockAlert: 5,
      categoryId: categories[0]?.id || "",
      description: "",
      images: ["/images/sabaton_tee.jpg"],
      colors: ["#111111", "#dc2626"],
      sizes: ["S", "M", "L", "XL"],
      badges: ["NEW"],
      tags: [],
      status: "ACTIVE",
      isFeatured: false,
      isNewArrival: true,
      isLimited: false,
    });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || "",
      costPerItem: prod.costPerItem || "",
      sku: prod.sku || "",
      stock: prod.stock,
      lowStockAlert: prod.lowStockAlert || 5,
      categoryId: prod.categoryId || "",
      description: prod.description || "",
      images: safeJsonParse(prod.images, []),
      colors: safeJsonParse(prod.colors, []),
      sizes: safeJsonParse(prod.sizes, []),
      badges: safeJsonParse(prod.badges, []),
      tags: safeJsonParse(prod.tags, []),
      status: prod.status || "ACTIVE",
      isFeatured: prod.isFeatured,
      isNewArrival: prod.isNewArrival,
      isLimited: prod.isLimited,
    });
    setError("");
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const body = new FormData();
    for (let i = 0; i < files.length; i++) {
      body.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.urls) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...data.urls],
        }));
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
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Product Catalog ({products.length})
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Manage merchandise, inventory levels, variants, and pricing
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, or tags..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 text-xs font-mono text-neutral-300 focus:border-amber-500 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Stock Status */}
        <select
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          className="rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 text-xs font-mono text-neutral-300 focus:border-amber-500 focus:outline-none"
        >
          <option value="ALL">All Stock Levels</option>
          <option value="in">In Stock (5+ items)</option>
          <option value="low">Low Stock (1-5 items)</option>
          <option value="out">Out of Stock (0 items)</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 text-xs font-mono text-neutral-300 focus:border-amber-500 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="stock-desc">Stock: High to Low</option>
          <option value="stock-asc">Stock: Low to High</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400">
                <th className="py-3.5 px-4 font-bold">PRODUCT</th>
                <th className="py-3.5 px-4 font-bold">SKU</th>
                <th className="py-3.5 px-4 font-bold">CATEGORY</th>
                <th className="py-3.5 px-4 font-bold">PRICE</th>
                <th className="py-3.5 px-4 font-bold">STOCK</th>
                <th className="py-3.5 px-4 font-bold">BADGES</th>
                <th className="py-3.5 px-4 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No products found matching query.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const imgs = safeJsonParse(p.images, []);
                  const badges = safeJsonParse(p.badges, []);
                  const thumb = imgs[0] || "/images/sabaton_tee.jpg";

                  return (
                    <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt={p.title}
                            className="h-11 w-11 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-neutral-200 font-sans text-xs line-clamp-1">
                              {p.title}
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono">
                              /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 text-neutral-400">{p.sku || "—"}</td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="rounded bg-neutral-800/80 px-2 py-0.5 text-[10px] text-neutral-300">
                          {p.category?.name || "Unassigned"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-white">${p.price}</span>
                        {p.compareAtPrice && (
                          <span className="ml-1.5 text-[10px] text-neutral-500 line-through">
                            ${p.compareAtPrice}
                          </span>
                        )}
                      </td>

                      {/* Stock Indicator */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            p.stock <= 0
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : p.stock <= 5
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          <span>{p.stock} units</span>
                        </span>
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {badges.map((b, i) => (
                            <span
                              key={i}
                              className="rounded bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-bold text-amber-300"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit"
                            className="rounded-lg border border-neutral-800 p-1.5 text-neutral-400 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            title="Delete"
                            className="rounded-lg border border-neutral-800 p-1.5 text-neutral-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ ADD / EDIT PRODUCT MODAL ============ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-white">
                {editingProduct ? "Edit Product" : "Create New Product"}
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
              {/* Product Title & Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                    PRODUCT TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder='e.g. "TEMPLARS" T-SHIRT BLACK'
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Compare Price, Cost, SKU */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                    PRICE ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="35.00"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                    COMPARE PRICE
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="45.00"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                    STOCK LEVEL
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                    SKU CODE
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="BRO-TEE-01"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multiple Image Uploader */}
              <div>
                <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                  PRODUCT IMAGES
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt="preview"
                        className="h-16 w-16 rounded-xl object-cover border border-neutral-800"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== idx),
                          })
                        }
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-950/60 hover:border-amber-500">
                    <Upload className="h-4 w-4 text-neutral-400" />
                    <span className="text-[9px] text-neutral-500 mt-1">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploading && <p className="text-[10px] text-amber-400">Uploading images...</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-[11px] font-bold text-neutral-400 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Vintage wash, drop shoulder cut, heavy GSM combed cotton..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Feature Flags */}
              <div className="flex flex-wrap gap-4 border-t border-neutral-800 pt-3">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Featured Hero</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-mono text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-mono text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isLimited}
                    onChange={(e) => setFormData({ ...formData, isLimited: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Limited Drop</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  <span>{saving ? "Saving..." : "Save Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
