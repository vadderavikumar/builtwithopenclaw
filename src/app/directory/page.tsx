import { Suspense } from "react";
import { DirectoryContent } from "@/components/directory-content";
import { SearchFilters } from "@/components/search-filters";

export const metadata = {
  title: "Directory",
  description: "Browse all products built with OpenClaw",
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Directory</h1>
        <p className="text-muted-foreground mt-1">
          Browse products built with OpenClaw. Filter by category, pricing, and more.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <SearchFilters />
        </aside>
        <div className="flex-1 min-w-0">
          <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
            <DirectoryContent params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
