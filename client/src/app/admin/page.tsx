import prisma from "@/lib/prisma";
import Link from "next/link";
import { UtensilsCrossed, Tag, EyeOff, Flame, Plus } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [totalItems, totalCategories, unavailableItems, todaySpecials] = await Promise.all([
    prisma.menuItem.count(),
    prisma.category.count(),
    prisma.menuItem.count({ where: { isAvailable: false } }),
    prisma.menuItem.count({ where: { isTodaySpecial: true } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-[#C9A84C] mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back. Here's a summary of your digital menu.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Items" value={totalItems} icon={<UtensilsCrossed />} color="text-blue-400" />
        <StatCard title="Categories" value={totalCategories} icon={<Tag />} color="text-purple-400" />
        <StatCard title="Unavailable" value={unavailableItems} icon={<EyeOff />} color="text-red-400" />
        <StatCard title="Today's Specials" value={todaySpecials} icon={<Flame />} color="text-orange-400" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-serif text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/items/new" className="flex items-center gap-2 bg-[#C9A84C] text-[#0B1F3A] px-6 py-3 rounded-lg font-bold hover:bg-[#b39540] transition-colors">
            <Plus className="h-5 w-5" /> Add New Item
          </Link>
          <Link href="/admin/categories/new" className="flex items-center gap-2 bg-foreground/10 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-foreground/20 border border-foreground/5 transition-colors">
            <Plus className="h-5 w-5" /> Add Category
          </Link>
          <Link href="/admin/items?filter=specials" className="flex items-center gap-2 bg-foreground/10 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-foreground/20 border border-foreground/5 transition-colors">
            <Flame className="h-5 w-5 text-orange-400" /> Manage Specials
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-foreground/5 ${color}`}>
        {icon}
      </div>
    </div>
  );
}
