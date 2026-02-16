"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  List,
  Star,
  FileText,
  CreditCard,
  FolderOpen,
  Flag,
  Mail,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/listings", label: "Listings", icon: List },
  { href: "/admin/blog", label: "Blog Content", icon: FileText },
  { href: "/admin/featured", label: "Featured ($49)", icon: Star },
  { href: "/admin/blog-featured", label: "Blog Featured ($29)", icon: Star },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/collections", label: "Collections", icon: FolderOpen },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <Link href="/admin" className="font-semibold">
          Admin
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t">
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full hover:bg-muted text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
