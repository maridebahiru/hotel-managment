import prisma from "@/lib/prisma";
import { createMenuItem } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NewItemPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/items" className="p-2 hover:bg-foreground/10 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-[#C9A84C]">Add New Item</h1>
          <p className="text-gray-400">Create a new dish for your menu.</p>
        </div>
      </div>

      <form action={createMenuItem} className="bg-foreground/5 border border-foreground/10 p-6 rounded-xl flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Name</label>
          <input type="text" name="name" required className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" placeholder="e.g. Truffle Pasta" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Description</label>
          <textarea name="description" rows={3} className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" placeholder="Brief description of the dish..."></textarea>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Price ($)</label>
            <input type="number" step="0.01" name="price" required className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" placeholder="0.00" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Category</label>
            <select name="categoryId" required className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C] appearance-none">
              {categories.map((c: { id: number; name: string }) => (
                <option key={c.id} value={c.id} className="bg-[#0B1F3A]">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Ingredients (Optional)</label>
          <input type="text" name="ingredients" className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" placeholder="e.g. Tomato, Cheese, Basil" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Meal Time</label>
            <select name="mealTime" className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C] appearance-none">
              <option value="AllDay" className="bg-[#0B1F3A]">All Day</option>
              <option value="Breakfast" className="bg-[#0B1F3A]">Breakfast</option>
              <option value="Lunch" className="bg-[#0B1F3A]">Lunch</option>
              <option value="Dinner" className="bg-[#0B1F3A]">Dinner</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Item Image</label>
            <input type="file" name="imageFile" accept="image/*" className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C] file:bg-[#C9A84C] file:text-[#0B1F3A] file:border-none file:rounded-md file:px-3 file:py-1 file:mr-4 file:cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 mb-3 block">Dietary Tags</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isVeg" className="w-4 h-4 accent-[#C9A84C]" /> Vegetarian
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isVegan" className="w-4 h-4 accent-[#C9A84C]" /> Vegan
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isNonVeg" className="w-4 h-4 accent-[#C9A84C]" /> Non-Veg
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isSpicy" className="w-4 h-4 accent-[#C9A84C]" /> Spicy
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Link href="/admin/items" className="px-6 py-3 rounded-lg font-medium hover:bg-foreground/10 transition-colors">Cancel</Link>
          <button type="submit" className="bg-[#C9A84C] text-[#0B1F3A] px-6 py-3 rounded-lg font-bold hover:bg-[#b39540] transition-colors">Create Item</button>
        </div>
      </form>
    </div>
  );
}
