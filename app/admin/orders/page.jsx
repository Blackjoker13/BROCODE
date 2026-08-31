"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Order Details Drawer
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [notes, setNotes] = useState("");

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (search) params.append("search", search);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        setStatusCounts(data.statusCounts || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
    setTrackingNumber(order.trackingNumber || "");
    setCarrier(order.carrier || "Correios / FedEx Express");
    setNotes(order.notes || "");
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          trackingNumber,
          carrier,
          notes,
        }),
      });

      const data = await res.json();
      if (data.order) {
        setSelectedOrder(data.order);
        fetchOrders();
      }
    } catch (err) {
      alert("Failed to update order: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            Customer Orders ({orders.length})
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            Track fulfillment, update shipping carriers, and generate invoices
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
        {[
          "ALL",
          "PENDING",
          "CONFIRMED",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
              statusFilter === st
                ? "bg-amber-500 text-black font-bold"
                : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <span>{st}</span>
            {statusCounts[st] !== undefined && (
              <span className="ml-1.5 opacity-70">({statusCounts[st]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order #, Customer Name, or Email..."
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Orders Data Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400">
              <th className="py-3.5 px-4 font-bold">ORDER</th>
              <th className="py-3.5 px-4 font-bold">DATE</th>
              <th className="py-3.5 px-4 font-bold">CUSTOMER</th>
              <th className="py-3.5 px-4 font-bold">ITEMS</th>
              <th className="py-3.5 px-4 font-bold">PAYMENT</th>
              <th className="py-3.5 px-4 font-bold">STATUS</th>
              <th className="py-3.5 px-4 font-bold text-right">TOTAL</th>
              <th className="py-3.5 px-4 font-bold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-500">
                  No orders found in this category.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-400">{o.orderNumber}</td>
                  <td className="py-3 px-4 text-neutral-400">
                    {new Date(o.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-sans font-bold text-neutral-200">{o.customerName}</div>
                    <div className="text-[10px] text-neutral-500">{o.customerEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {o.items?.length || 0} product(s)
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        o.orderStatus === "DELIVERED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : o.orderStatus === "SHIPPED"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : o.orderStatus === "PROCESSING"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : o.orderStatus === "CANCELLED"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    ${o.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openOrderDetail(o)}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] font-bold text-neutral-300 hover:border-amber-500 hover:text-amber-300"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============ ORDER DETAIL MODAL ============ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-heading text-lg font-bold text-white">
                  ORDER #{selectedOrder.orderNumber}
                </span>
                <span className="font-mono text-xs text-neutral-400">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  title="Print Packing Slip"
                  className="rounded-lg border border-neutral-800 p-1.5 text-neutral-400 hover:text-white"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-1 text-neutral-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3 font-sans text-xs">
              {/* Customer & Shipping Details */}
              <div className="space-y-3 rounded-xl border border-neutral-800/80 bg-neutral-950/50 p-4">
                <div className="font-mono text-[11px] font-bold text-amber-400 uppercase">
                  Customer Profile
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">
                    {selectedOrder.customerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-neutral-800 pt-2 text-neutral-400">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 uppercase font-bold">
                    <MapPin className="h-3 w-3" />
                    <span>Destination Address</span>
                  </div>
                  <p className="mt-1 text-[11px]">
                    South America Shipping Hub // Express Zone
                  </p>
                </div>
              </div>

              {/* Status Controls */}
              <div className="sm:col-span-2 space-y-3 rounded-xl border border-neutral-800/80 bg-neutral-950/50 p-4">
                <div className="font-mono text-[11px] font-bold text-amber-400 uppercase">
                  Fulfillment & Logistics
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                      ORDER STATUS
                    </label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                      PAYMENT STATUS
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                      TRACKING NUMBER
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BR-884920194SA"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                      CARRIER
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g. Correios Express"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdateOrder}
                  disabled={updating}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-mono text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50"
                >
                  <Truck className="h-4 w-4" />
                  <span>{updating ? "Saving..." : "Update Order Status"}</span>
                </button>
              </div>
            </div>

            {/* Line Items List */}
            <div className="mt-5 border-t border-neutral-800 pt-4">
              <div className="font-mono text-[11px] font-bold text-neutral-400 uppercase mb-3">
                Purchased Merchandise ({selectedOrder.items?.length})
              </div>

              <div className="divide-y divide-neutral-800/60 rounded-xl border border-neutral-800 bg-neutral-950/40">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image || "/images/sabaton_tee.jpg"}
                        alt={it.title}
                        className="h-10 w-10 rounded-lg object-cover bg-neutral-900 border border-neutral-800"
                      />
                      <div>
                        <div className="font-bold text-white">{it.title}</div>
                        <div className="font-mono text-[10px] text-neutral-500">
                          {it.variant || "Standard Edition"} × {it.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-white text-xs">
                      ${it.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals Summary */}
              <div className="mt-4 flex justify-end font-mono text-xs">
                <div className="w-64 space-y-1.5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({selectedOrder.couponCode || "Coupon"}):</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-800 pt-1.5 font-bold text-amber-400 text-sm">
                    <span>Total Amount:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
