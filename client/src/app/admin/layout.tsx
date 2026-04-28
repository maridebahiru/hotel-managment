import Link from "next/link";
import { LogOut, LayoutDashboard, UtensilsCrossed, Settings, Tag } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-foreground/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-foreground/10 flex justify-between items-center">
          <h2 className="text-xl font-serif text-[#C9A84C]">Admin Portal</h2>
          <ThemeToggle />
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-foreground/5 transition-colors">
            <LayoutDashboard className="h-5 w-5 text-gray-400" /> Dashboard
          </Link>
          <Link href="/admin/items" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-foreground/5 transition-colors">
            <UtensilsCrossed className="h-5 w-5 text-gray-400" /> Menu Items
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-foreground/5 transition-colors">
            <Tag className="h-5 w-5 text-gray-400" /> Categories
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-foreground/5 transition-colors">
            <Settings className="h-5 w-5 text-gray-400" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-foreground/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-foreground/5 transition-colors text-gray-400">
            <LogOut className="h-5 w-5" /> View Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
