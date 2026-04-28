import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      fullName: 'System Administrator',
      role: UserRole.ADMIN,
    },
  });

  const categories = ['Electronics', 'Accessories', 'Furniture', 'Audio'];
  const createdCategories = await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const getCategoryId = (name: string) =>
    createdCategories.find((c) => c.name === name)?.id;

  // 3. สร้าง Products
  const products = [
    {
      productCode: 'P001',
      name: 'Mechanical Keyboard',
      price: 2990.0,
      stock: 50,
      unit: 'pcs',
      categoryId: getCategoryId('Electronics'),
    },
    {
      productCode: 'P002',
      name: 'Gaming Mouse',
      price: 1590.0,
      stock: 100,
      unit: 'pcs',
      categoryId: getCategoryId('Electronics'),
    },
    {
      productCode: 'P003',
      name: 'USB-C Docking Station',
      price: 1250.0,
      stock: 30,
      unit: 'pcs',
      categoryId: getCategoryId('Accessories'),
    },
    {
      productCode: 'P004',
      name: '27-inch 4K Monitor',
      price: 8900.0,
      stock: 15,
      unit: 'pcs',
      categoryId: getCategoryId('Electronics'),
    },
    {
      productCode: 'P005',
      name: 'Ergonomic Office Chair',
      price: 4500.0,
      stock: 10,
      unit: 'pcs',
      categoryId: getCategoryId('Furniture'),
    },
    {
      productCode: 'P006',
      name: 'Noise Cancelling Headphones',
      price: 5990.0,
      stock: 25,
      unit: 'pcs',
      categoryId: getCategoryId('Audio'),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { productCode: product.productCode },
      update: { categoryId: product.categoryId },
      create: product,
    });
  }
  console.log('Seed data (Admin + Catalog) created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
