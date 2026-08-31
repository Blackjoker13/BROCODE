"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Trash2, Plus, X, Check, MessageSquare } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    customerEmail: "",
    rating: 5,
    comment: "",
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {}
  };

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const handleToggleApproval = async (id, currentApproved) => {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentApproved }),
      });
      fetchReviews();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      fetchReviews();
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchReviews();
      }
    } catch (e) {
      alert("Failed to submit review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Customer Reviews & Ratings ({reviews.length})
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Moderate merchandise feedback, verify star ratings, and publish social proof
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              productId: products[0]?.id || "",
              customerName: "",
              customerEmail: "",
              rating: 5,
              comment: "",
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Reviews Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400">
              <th className="py-3.5 px-4 font-bold">PRODUCT</th>
              <th className="py-3.5 px-4 font-bold">RATING</th>
              <th className="py-3.5 px-4 font-bold">CUSTOMER & COMMENT</th>
              <th className="py-3.5 px-4 font-bold">STATUS</th>
              <th className="py-3.5 px-4 font-bold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-neutral-500">
                  No customer reviews submitted yet.
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-sans font-bold text-white">
                      {r.product?.title || "Product"}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-neutral-200 font-sans">{r.customerName}</div>
                    <p className="font-sans text-neutral-400 text-xs mt-0.5 line-clamp-2">
                      "{r.comment}"
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        r.isApproved
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {r.isApproved ? "Approved ✓" : "Pending"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleApproval(r.id, r.isApproved)}
                        className={`rounded-lg p-1.5 border border-neutral-800 ${
                          r.isApproved
                            ? "text-neutral-400 hover:text-amber-400"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                        title={r.isApproved ? "Unpublish" : "Approve"}
                      >
                        {r.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="rounded-lg p-1.5 border border-neutral-800 text-neutral-400 hover:border-red-500 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-heading text-lg font-bold uppercase text-white">
                Submit Product Review
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="mt-4 space-y-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  PRODUCT
                </label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    CUSTOMER NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Leo Cruz"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    STAR RATING
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  REVIEW COMMENT *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Heavy fabric, insane print details, fits oversized perfectly..."
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
                  className="rounded-xl bg-amber-500 px-5 py-2 font-mono font-bold text-black hover:bg-amber-400"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
