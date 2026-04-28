import prisma from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, XCircle, Tag } from "lucide-react";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: { items: true }
      }
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#C9A84C] mb-2">Categories</h1>
          <p className="text-gray-400">Manage your menu categories and their display order.</p>
        </div>
        <Link href="/admin/categories/new" className="bg-[#C9A84C] text-[#0B1F3A] px-4 py-2 rounded-lg font-bold">Add Category</Link>
      </div>

      <div className="bg-foreground/5 border border-foreground/10 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-foreground/5 border-b border-foreground/10 text-gray-400">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Items Count</th>
              <th className="p-4 font-medium">Visibility</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((category: any) => (
              <tr key={category.id} className="hover:bg-foreground/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-foreground/10 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-300">{category.displayOrder}</td>
                <td className="p-4 text-gray-300">{category._count.items} items</td>
                <td className="p-4">
                  {category.isVisible ? (
                    <span className="inline-flex items-center gap-1 text-green-400 text-sm"><CheckCircle2 className="h-4 w-4" /> Visible</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 text-sm"><XCircle className="h-4 w-4" /> Hidden</span>
                  )}
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
