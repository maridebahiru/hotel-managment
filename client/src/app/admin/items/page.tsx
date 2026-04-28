import prisma from "@/lib/prisma";
import { UtensilsCrossed, Star, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const isSpecialsFilter = params.filter === 'specials';

  const items = await prisma.menuItem.findMany({
    where: isSpecialsFilter ? { OR: [{ isChefSpecial: true }, { isTodaySpecial: true }] } : {},
    include: { category: true },
    orderBy: { categoryId: 'asc' }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#C9A84C] mb-2">Menu Items</h1>
          <p className="text-gray-400">Manage your dishes, availability, and specials.</p>
        </div>
        <Link href="/admin/items/new" className="bg-[#C9A84C] text-[#0B1F3A] px-4 py-2 rounded-lg font-bold">Add Item</Link>
      </div>

      <div className="bg-foreground/5 border border-foreground/10 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-foreground/5 border-b border-foreground/10 text-gray-400">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Specials</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item: any) => (
              <tr key={item.id} className="hover:bg-foreground/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover bg-black/20" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-foreground/10 flex items-center justify-center">
                        <UtensilsCrossed className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-300">{item.category.name}</td>
                <td className="p-4 text-gray-300">{item.price.toLocaleString()} ETB</td>
                <td className="p-4">
                  {item.isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-green-400 text-sm"><CheckCircle2 className="h-4 w-4" /> Available</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 text-sm"><XCircle className="h-4 w-4" /> Unavailable</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {item.isChefSpecial && <span title="Chef Special"><Star className="h-4 w-4 text-[#C9A84C] fill-current" /></span>}
                    {item.isTodaySpecial && <span title="Today's Special"><Star className="h-4 w-4 text-orange-400 fill-current" /></span>}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="text-[#C9A84C] hover:underline text-sm font-medium mr-4">Edit</button>
                  <button className="text-red-400 hover:underline text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
