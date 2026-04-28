"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// --- Menu Item Actions ---
export async function toggleItemAvailability(id: number, currentStatus: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !currentStatus },
  });
  revalidatePath("/");
  revalidatePath("/admin/items");
}

export async function deleteItem(id: number) {
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/items");
}

export async function toggleChefSpecial(id: number, currentStatus: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isChefSpecial: !currentStatus },
  });
  revalidatePath("/");
  revalidatePath("/admin/items");
}

async function saveFile(file: File | null, folder: string = "uploads") {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const uploadDir = join(process.cwd(), "public", folder);
  
  try {
    await mkdir(uploadDir, { recursive: true });
    const path = join(uploadDir, filename);
    await writeFile(path, buffer);
    return `/${folder}/${filename}`;
  } catch (error) {
    console.error(`Failed to upload file to ${folder}:`, error);
    return null;
  }
}

export async function createMenuItem(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = parseInt(formData.get("categoryId") as string);
  const mealTime = formData.get("mealTime") as string;
  const ingredients = formData.get("ingredients") as string;
  
  const imageFile = formData.get("imageFile") as File | null;
  const imageUrl = await saveFile(imageFile);

  const isVeg = formData.get("isVeg") === "on";
  const isNonVeg = formData.get("isNonVeg") === "on";
  const isVegan = formData.get("isVegan") === "on";
  const isSpicy = formData.get("isSpicy") === "on";

  await prisma.menuItem.create({
    data: {
      name,
      description,
      price,
      categoryId,
      mealTime,
      ingredients: ingredients || null,
      imageUrl,
      isVeg,
      isNonVeg,
      isVegan,
      isSpicy,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/items");
  redirect("/admin/items");
}

// --- Category Actions ---
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const displayOrder = parseInt(formData.get("displayOrder") as string) || 0;
  const isVisible = formData.get("isVisible") === "on";

  await prisma.category.create({
    data: {
      name,
      displayOrder,
      isVisible,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: number) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

// --- Settings Actions ---
export async function updateSettings(formData: FormData) {
  const hotelName = formData.get("hotelName") as string;
  const tagline = formData.get("tagline") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const announcement = formData.get("announcement") as string;
  const showAnnouncement = formData.get("showAnnouncement") === "on";

  const logoFile = formData.get("logoFile") as File | null;
  const heroFile = formData.get("heroFile") as File | null;

  const logoUrl = await saveFile(logoFile, "images");
  const heroImageUrl = await saveFile(heroFile, "images");

  const currentSettings = await prisma.settings.findFirst({ where: { id: 1 } });

  await prisma.settings.update({
    where: { id: 1 },
    data: {
      hotelName,
      tagline,
      address,
      phone,
      announcement,
      showAnnouncement,
      ...(logoUrl && { logoUrl }),
      ...(heroImageUrl && { heroImageUrl }),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin");
}
