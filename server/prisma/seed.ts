import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.admin.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      email: 'admin@hotel.com',
      password: hashedPassword,
    },
  })

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      hotelName: "The Grand Sapphire",
      tagline: "Experience culinary excellence.",
      address: "123 Luxury Ave, Ocean View",
      phone: "+1 (555) 123-4567",
      heroImageUrl: "/images/hero.png",
      logoUrl: "/images/logo.png",
      showAnnouncement: true,
      announcement: "Special Valentine's menu available this week!",
      socialLinks: JSON.stringify({
        instagram: "https://instagram.com",
        facebook: "https://facebook.com"
      })
    }
  })

  // Clear existing data
  await prisma.menuItem.deleteMany()
  await prisma.category.deleteMany()

  const starters = await prisma.category.create({
    data: { name: 'Starters', displayOrder: 1, isVisible: true }
  })
  
  const mains = await prisma.category.create({
    data: { name: 'Main Course', displayOrder: 2, isVisible: true }
  })
  
  const desserts = await prisma.category.create({
    data: { name: 'Desserts', displayOrder: 3, isVisible: true }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Truffle Bruschetta',
      description: 'Toasted artisan bread topped with wild mushrooms, truffle oil, and shaved parmesan.',
      ingredients: 'Artisan Bread, Wild Mushrooms, Truffle Oil, Parmesan Cheese, Garlic, Parsley',
      imageUrl: '/images/bruschetta.png',
      price: 450.00,
      categoryId: starters.id,
      isAvailable: true,
      isChefSpecial: true,
      isVeg: true,
      mealTime: 'AllDay'
    }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Wagyu Ribeye',
      description: 'Premium wagyu beef, garlic herb butter, roasted asparagus.',
      ingredients: 'Wagyu Beef, Garlic, Herb Butter, Asparagus, Sea Salt, Black Pepper',
      imageUrl: '/images/ribeye.png',
      price: 2500.00,
      categoryId: mains.id,
      isAvailable: true,
      isBestSeller: true,
      isTodaySpecial: true,
      isNonVeg: true,
      mealTime: 'Dinner'
    }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Saffron Risotto',
      description: 'Creamy Arborio rice with saffron threads, white wine, and pecorino romano.',
      ingredients: 'Arborio Rice, Saffron, White Wine, Pecorino Romano, Vegetable Stock, Onion',
      imageUrl: '/images/risotto.png',
      price: 850.00,
      categoryId: mains.id,
      isAvailable: true,
      isVeg: true,
      mealTime: 'AllDay'
    }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Dark Chocolate Fondant',
      description: 'Warm chocolate cake with a gooey center, served with vanilla bean ice cream.',
      ingredients: 'Dark Chocolate, Flour, Butter, Eggs, Sugar, Vanilla Ice Cream',
      imageUrl: '/images/fondant.png',
      price: 380.00,
      categoryId: desserts.id,
      isAvailable: true,
      isVeg: true,
      mealTime: 'AllDay'
    }
  })

  console.log("Database seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
