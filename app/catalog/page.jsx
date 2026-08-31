import { Suspense } from "react";
import CatalogView from "@/components/storefront/CatalogView";

export const metadata = {
  title: "Catalog & Categories — BROCODE Archive",
  description: "Browse the full collection of Brocode streetwear, band merch, tactical hardware, and gothic relics.",
};

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#000000] text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="font-geometric text-[10px] font-black uppercase tracking-widest text-neutral-400">
              LOADING BROCODE CATALOG...
            </span>
          </div>
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  );
}
