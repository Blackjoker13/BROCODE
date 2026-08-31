import { Suspense } from "react";
import CatalogView from "@/components/storefront/CatalogView";

export const metadata = {
  title: "Categories & Catalogs — BROCODE Archive",
  description: "Browse all categories and catalogs in the Brocode ecosystem.",
};

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#000000] text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="font-geometric text-[10px] font-black uppercase tracking-widest text-neutral-400">
              LOADING BROCODE CATEGORIES...
            </span>
          </div>
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  );
}
