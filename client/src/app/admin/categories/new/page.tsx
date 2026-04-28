import { createCategory } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 hover:bg-foreground/10 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-[#C9A84C]">Add Category</h1>
          <p className="text-gray-400">Create a new section for your menu.</p>
        </div>
      </div>

      <form action={createCategory} className="bg-foreground/5 border border-foreground/10 p-6 rounded-xl flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Category Name</label>
          <input type="text" name="name" required className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" placeholder="e.g. Starters" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Display Order</label>
          <input type="number" name="displayOrder" defaultValue="0" required className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" placeholder="0" />
          <p className="text-xs text-gray-500">Lower numbers appear first.</p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isVisible" name="isVisible" defaultChecked className="w-4 h-4 accent-[#C9A84C]" />
          <label htmlFor="isVisible" className="text-sm font-medium text-gray-300 cursor-pointer">Visible to Guests</label>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Link href="/admin/categories" className="px-6 py-3 rounded-lg font-medium hover:bg-foreground/10 transition-colors">Cancel</Link>
          <button type="submit" className="bg-[#C9A84C] text-[#0B1F3A] px-6 py-3 rounded-lg font-bold hover:bg-[#b39540] transition-colors">Create Category</button>
        </div>
      </form>
    </div>
  );
}
