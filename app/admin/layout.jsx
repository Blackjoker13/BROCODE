"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Image as ImageIcon,
  FileText,
  BarChart3,
  Star,
  UserCog,
  Settings,
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Eye,
  Sparkles,
  Compass,
  Camera,
  Music,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Live Customer Preview", href: "/admin/preview", icon: Eye, badge: "VERIFY" },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Offers & Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Banners CMS", href: "/admin/banners", icon: ImageIcon },
  { label: "Background Music", href: "/admin/music", icon: Music, badge: "AUDIO" },
  { label: "Social Media & Feed", href: "/admin/social", icon: Camera, badge: "FEED" },
  { label: "About Us Studio", href: "/admin/about", icon: Sparkles, badge: "STORY" },
  { label: "Dimensions Manual", href: "/admin/guidelines", icon: Compass, badge: "SPECS" },
  { label: "Website Content", href: "/admin/content", icon: FileText },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Admin Users", href: "/admin/users", icon: UserCog },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;

    // Fetch Admin Me
    fetch("/api/admin/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.admin) setAdminUser(data.admin);
      })
      .catch(() => {
        router.push("/admin/login");
      });

    // Fetch Notifications
    fetch("/api/admin/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      router.push("/admin/login");
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* ============ MOBILE SIDEBAR OVERLAY ============ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============ SIDEBAR ============ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800/80 bg-neutral-900/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-800/80 px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              src="/images/brocode_logo_v2.png"
              alt="BROCODE"
              className="h-6 w-auto object-contain brightness-110"
            />
            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-400 border border-amber-500/20">
              ADMIN
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-neutral-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">
            Store Management
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/10"
                    : "text-neutral-400 hover:bg-neutral-800/80 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-black" : "text-neutral-400 group-hover:text-amber-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Store Shortcut */}
        <div className="border-t border-neutral-800/80 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl bg-neutral-950/80 px-3 py-2.5 text-xs font-mono text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white border border-neutral-800"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Storefront</span>
            </span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </aside>

      {/* ============ MAIN CONTENT AREA ============ */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Sticky Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800/80 bg-neutral-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden font-mono text-xs text-neutral-500 sm:inline-block">
              BROCODE CONTROL CENTER // {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Preview & Verify Button */}
            <Link
              href="/admin/preview"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-mono font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview & Verify</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative rounded-xl border border-neutral-800 bg-neutral-900/80 p-2 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-200">
                      Notifications ({notifications.length})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-neutral-500">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`rounded-xl p-2.5 text-xs transition-colors ${
                            n.isRead
                              ? "bg-neutral-950/40 text-neutral-400"
                              : "bg-amber-500/10 border border-amber-500/20 text-neutral-200"
                          }`}
                        >
                          <div className="font-bold">{n.title}</div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">
                            {n.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-3 border-l border-neutral-800 pl-3">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-neutral-200">
                  {adminUser?.name || "Commander"}
                </div>
                <div className="font-mono text-[10px] text-amber-400">
                  {adminUser?.role || "SUPER_ADMIN"}
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs font-mono text-neutral-300 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
