"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Flame, Star, Leaf, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = {
  id: number;
  name: string;
};

type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryId: number;
  category: Category;
  imageUrl: string | null;
  isAvailable: boolean;
  isChefSpecial: boolean;
  isBestSeller: boolean;
  isTodaySpecial: boolean;
  isVeg: boolean;
  isNonVeg: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  ingredients: string | null;
  mealTime: string;
};

export default function MenuClient({
  categories,
  menuItems,
}: {
  categories: Category[];
  menuItems: MenuItem[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [activeMealTime, setActiveMealTime] = useState<string>("AllDay");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Determine current meal time on load
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) setActiveMealTime("Breakfast");
    else if (hour >= 11 && hour < 16) setActiveMealTime("Lunch");
    else if (hour >= 16 && hour < 23) setActiveMealTime("Dinner");
    else setActiveMealTime("AllDay");
  }, []);

  const mealTimes = ["AllDay", "Breakfast", "Lunch", "Dinner"];

  // Filter items based on search, category, and meal time
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = activeCategory === "all" || item.categoryId === activeCategory;
      const matchesMeal = activeMealTime === "AllDay" || item.mealTime === "AllDay" || item.mealTime === activeMealTime;
      return matchesSearch && matchesCategory && matchesMeal;
    });
  }, [menuItems, search, activeCategory, activeMealTime]);

  const todaysSpecials = useMemo(() => filteredItems.filter(i => i.isTodaySpecial), [filteredItems]);
  const regularItems = useMemo(() => filteredItems.filter(i => !i.isTodaySpecial), [filteredItems]);

  // Group regular items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    categories.forEach(c => { groups[c.name] = []; });
    regularItems.forEach(item => {
      if (groups[item.category.name]) {
        groups[item.category.name].push(item);
      } else {
        groups[item.category.name] = [item];
      }
    });
    return groups;
  }, [regularItems, categories]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Search and Filters Bar */}
      <div className="bg-background dark:bg-[#07162b] p-4 rounded-2xl shadow-xl shadow-black/20 flex flex-col md:flex-row gap-4 justify-between items-center border border-foreground/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search menu..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-foreground/5 border border-foreground/10 rounded-full py-2 pl-10 pr-4 text-foreground focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>
        
        {/* Meal Time Tabs */}
        <div className="flex bg-foreground/5 rounded-full p-1 overflow-x-auto w-full md:w-auto scrollbar-hide">
          {mealTimes.map(time => (
            <button
              key={time}
              onClick={() => setActiveMealTime(time)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeMealTime === time ? "bg-[#C9A84C] text-[#0B1F3A] shadow-md" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {time === "AllDay" ? "All Day" : time}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sticky top-4 z-40 bg-background/80 backdrop-blur-md py-2 px-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
            activeCategory === "all" ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-foreground hover:border-[#C9A84C] hover:text-[#C9A84C]"
          }`}
        >
          All Menus
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
              activeCategory === cat.id ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-foreground hover:border-[#C9A84C] hover:text-[#C9A84C]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Today's Specials */}
      {todaysSpecials.length > 0 && activeCategory === "all" && !search && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Flame className="text-[#C9A84C] h-6 w-6" />
            <h2 className="text-3xl font-serif text-foreground text-center">Today's Specials</h2>
            <Flame className="text-[#C9A84C] h-6 w-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todaysSpecials.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                featured 
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Regular Categories */}
      <div className="flex flex-col gap-12">
        {categories.map(category => {
          const items = groupedItems[category.name];
          if (!items || items.length === 0) return null;
          
          return (
            <motion.section 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24"
              id={`cat-${category.id}`}
            >
              <h3 className="text-2xl font-serif text-[#C9A84C] border-b border-foreground/10 pb-2 mb-6 flex items-center gap-2">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-foreground/60">
            <UtensilsCrossed className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>No menu items found.</p>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-background dark:bg-[#0B1F3A] w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col border border-foreground/10"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <Search className="h-5 w-5 rotate-45" />
              </button>

              <div className="overflow-y-auto">
                {selectedItem.imageUrl && (
                  <div className="h-64 md:h-80 w-full overflow-hidden">
                    <img 
                      src={selectedItem.imageUrl} 
                      alt={selectedItem.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-[#C9A84C]">{selectedItem.name}</h2>
                    <div className="text-2xl font-bold text-foreground">
                      {selectedItem.price.toLocaleString()} <span className="text-sm font-semibold text-[#C9A84C]">ETB</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedItem.isChefSpecial && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-sm font-semibold border border-[#C9A84C]/30">
                        <Star className="h-4 w-4 fill-current" /> Chef's Special
                      </span>
                    )}
                    {selectedItem.isVeg && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold border border-green-500/30">
                        <Leaf className="h-4 w-4" /> Veg
                      </span>
                    )}
                    {selectedItem.isSpicy && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold border border-red-500/30">
                        <Flame className="h-4 w-4" /> Spicy
                      </span>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        <UtensilsCrossed className="h-5 w-5 text-[#C9A84C]" /> Description
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {selectedItem.description || "No description available."}
                      </p>
                    </div>

                    {selectedItem.ingredients && (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-[#C9A84C]" /> Ingredients
                        </h3>
                        <p className="text-foreground/70 leading-relaxed italic">
                          {selectedItem.ingredients}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItemCard({ item, featured = false, onClick }: { item: MenuItem, featured?: boolean, onClick?: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border cursor-pointer ${featured ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-foreground/5 bg-foreground/5 hover:bg-foreground/10'} transition-colors duration-300`}
    >
      {item.imageUrl && (
        <div className="h-48 w-full overflow-hidden bg-black/20">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      
      <div className="p-5 flex flex-col gap-2 h-full">
        <div className="flex justify-between items-start gap-4">
          <h4 className="font-serif text-xl text-foreground font-medium group-hover:text-[#C9A84C] transition-colors">{item.name}</h4>
          <span className="text-[#C9A84C] font-semibold text-lg whitespace-nowrap">{item.price.toLocaleString()} <small className="text-xs">ETB</small></span>
        </div>
        
        {item.description && (
          <p className="text-sm text-foreground/60 leading-relaxed flex-grow">
            {item.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          {item.isChefSpecial && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-semibold">
              <Star className="h-3 w-3 fill-current" /> Chef's Special
            </span>
          )}
          {item.isVeg && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-semibold">
              <Leaf className="h-3 w-3" /> Veg
            </span>
          )}
          {item.isVegan && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Leaf className="h-3 w-3" /> Vegan
            </span>
          )}
          {item.isSpicy && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-semibold">
              <Flame className="h-3 w-3" /> Spicy
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
