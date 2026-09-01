"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { safeJsonParse } from "@/lib/utils";

const StorefrontContext = createContext({
  categories: [],
  products: [],
  heroProducts: [],
  newArrivals: [],
  accessories: [],
  featuredDrop: [],
  tourBanner: null,
  featuredDropBanner: null,
  cms: {},
  settings: {},
  cart: [],
  activeTheme: "noir",
  setActiveTheme: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  placeOrder: async () => {},
  refreshData: () => {},
});

export function StorefrontProvider({ children, initialData }) {
  const [data, setData] = useState(
    initialData || {
      categories: [],
      products: [],
      heroProducts: [],
      newArrivals: [],
      accessories: [],
      featuredDrop: [],
      tourBanner: null,
      featuredDropBanner: null,
      cms: {},
      settings: {},
    }
  );

  // Active full-site theme: "noir" | "cyber" | "ragnarok"
  const [activeTheme, setActiveThemeState] = useState("noir");

  const setActiveTheme = useCallback((theme) => {
    setActiveThemeState(theme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", activeTheme);
    }
  }, [activeTheme]);

  // Cart state in LocalStorage
  const [cart, setCart] = useState([]);

  // Client refresh handler (used after admin edits, tab switch, or interval)
  const refreshData = useCallback(async () => {
    try {
      const isPreview =
        typeof window !== "undefined" &&
        (window.location.search.includes("preview=draft") ||
          window.location.search.includes("preview=true") ||
          window.self !== window.top);

      const previewQuery = isPreview ? "&preview=draft" : "";
      const res = await fetch(`/api/storefront/data?t=${Date.now()}${previewQuery}`, {
        cache: "no-store",
        headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" },
      });
      const d = await res.json();
      if (d && d.success && d.categories && d.categories.length > 0) {
        setData(d);
      }
    } catch (e) {
      console.warn("Real-time storefront sync notice:", e.message);
    }
  }, []);

  useEffect(() => {
    if (initialData && initialData.categories && initialData.categories.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    // Initial fresh sync on mount
    refreshData();

    // Auto-refresh when user focuses the tab or switches back from Admin panel
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        refreshData();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    // Silent background poll every 8 seconds
    const interval = setInterval(refreshData, 8000);

    // Load persisted cart from localStorage
    try {
      const saved = localStorage.getItem("brocode_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      clearInterval(interval);
    };
  }, [refreshData]);

  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem("brocode_cart", JSON.stringify(newCart));
    } catch (e) {}
  };

  const addToCart = (product, variant = "Standard Edition", quantity = 1) => {
    const existingIdx = cart.findIndex(
      (c) => c.productId === product.id && c.variant === variant
    );
    let newCart = [...cart];
    if (existingIdx > -1) {
      newCart[existingIdx].quantity += quantity;
    } else {
      const imgs = safeJsonParse(product.images, []);
      newCart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: imgs[0] || "/images/sabaton_tee.jpg",
        variant,
        quantity,
      });
    }
    saveCart(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const placeOrder = async (customerDetails, couponCode = null) => {
    if (cart.length === 0) return { success: false, error: "Cart is empty" };

    try {
      const body = {
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        shippingAddress: customerDetails.address,
        couponCode: couponCode || undefined,
        items: cart.map((item) => ({
          productId: item.productId,
          variantTitle: item.variant,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      };

      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        clearCart();
        refreshData();
        return { success: true, order: resData.order };
      } else {
        return { success: false, error: resData.error || "Order failed" };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  return (
    <StorefrontContext.Provider
      value={{
        ...data,
        cart,
        activeTheme,
        setActiveTheme,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        refreshData,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  return useContext(StorefrontContext);
}
