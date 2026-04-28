import prisma from "@/lib/prisma";
import { updateSettings } from "../actions";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findFirst({ where: { id: 1 } });

  if (!settings) return null;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-serif text-[#C9A84C] mb-2">Settings</h1>
        <p className="text-gray-400">Manage your hotel's branding and announcements.</p>
      </div>

      <form action={updateSettings} className="bg-foreground/5 border border-foreground/10 p-6 rounded-xl flex flex-col gap-8">
        
        {/* Branding */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-serif text-foreground border-b border-foreground/10 pb-2">Branding</h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Hotel Name</label>
            <input type="text" name="hotelName" defaultValue={settings.hotelName} required className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Tagline / Subheading</label>
            <input type="text" name="tagline" defaultValue={settings.tagline} required className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Logo</label>
              <input type="file" name="logoFile" accept="image/*" className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C] file:bg-[#C9A84C] file:text-[#0B1F3A] file:border-none file:rounded-md file:px-2 file:py-1 file:mr-2 file:text-xs" />
              {settings.logoUrl && <p className="text-xs text-gray-500 italic">Current: {settings.logoUrl}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Hero Image</label>
              <input type="file" name="heroFile" accept="image/*" className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C] file:bg-[#C9A84C] file:text-[#0B1F3A] file:border-none file:rounded-md file:px-2 file:py-1 file:mr-2 file:text-xs" />
              {settings.heroImageUrl && <p className="text-xs text-gray-500 italic">Current: {settings.heroImageUrl}</p>}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-serif text-foreground border-b border-foreground/10 pb-2">Contact Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Address</label>
              <input type="text" name="address" defaultValue={settings.address || ""} className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <input type="text" name="phone" defaultValue={settings.phone || ""} className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </div>
        </section>

        {/* Announcement Bar */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-serif text-foreground border-b border-foreground/10 pb-2">Announcement Bar</h2>
          
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" id="showAnnouncement" name="showAnnouncement" defaultChecked={settings.showAnnouncement} className="w-4 h-4 accent-[#C9A84C]" />
            <label htmlFor="showAnnouncement" className="text-sm font-medium text-gray-300 cursor-pointer">Show Announcement Bar on Public Menu</label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Announcement Text</label>
            <input type="text" name="announcement" defaultValue={settings.announcement || ""} className="bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-[#C9A84C]" placeholder="e.g. Kitchen closed on Sundays." />
          </div>
        </section>

        <div className="flex justify-end pt-4 border-t border-foreground/10">
          <button type="submit" className="bg-[#C9A84C] text-[#0B1F3A] px-8 py-3 rounded-lg font-bold hover:bg-[#b39540] transition-colors">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
