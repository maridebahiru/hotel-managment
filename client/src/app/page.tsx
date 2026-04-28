import prisma from "@/lib/prisma"
import MenuClient from "./MenuClient"
import { ThemeToggle } from "@/components/ThemeToggle"

export const revalidate = 0 // dynamic

export default async function PublicMenuPage() {
  const settings = await prisma.settings.findFirst({ where: { id: 1 } })
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { displayOrder: 'asc' }
  })
  
  const menuItems = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    include: { category: true }
  })

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-[#C9A84C] selection:text-foreground pb-20">
      {/* Announcement Bar */}
      {settings?.showAnnouncement && settings.announcement && (
        <div className="bg-[#C9A84C] text-[#0B1F3A] py-2 px-4 text-center font-medium text-sm z-50 relative">
          {settings.announcement}
        </div>
      )}

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <header className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        {settings?.heroImageUrl ? (
          <img 
            src={settings.heroImageUrl} 
            alt="Hero Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background z-0" />
        )}
        
        <div className="relative z-20 text-center px-4 flex flex-col items-center">
          {settings?.logoUrl && (
            <img src={settings.logoUrl} alt="Logo" className="h-16 w-auto mb-4" />
          )}
          <h1 className="text-4xl md:text-6xl font-serif text-[#C9A84C] mb-4 tracking-wider">
            {settings?.hotelName || "The Grand Hotel"}
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-200 max-w-2xl mx-auto">
            {settings?.tagline || "Experience our culinary delights."}
          </p>
        </div>
      </header>

      {/* Menu Client (Filters, Search, Items) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <MenuClient categories={categories} menuItems={menuItems} />
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-foreground/10 pt-10 pb-10 text-center text-sm text-foreground/60">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <h3 className="text-xl font-serif text-[#C9A84C]">{settings?.hotelName}</h3>
          <p>{settings?.address}</p>
          <p>{settings?.phone}</p>
          <div className="flex gap-4 mt-4">
            {/* Social links parsed from JSON if exists */}
          </div>
          <p className="mt-8 text-xs opacity-50">&copy; {new Date().getFullYear()} {settings?.hotelName}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
