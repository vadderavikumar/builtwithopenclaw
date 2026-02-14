import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Admin",
    description: "BuiltWithOpenClaw admin",
    path: "/admin",
    noIndex: true,
  }),
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
