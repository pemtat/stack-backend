import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createPaginationMeta } from 'src/common/utils/pagination.util';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 20, search: string = '') {
    const safeLimit = Math.min(limit, 100);
    const safePage = Math.max(1, page);
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { productCode: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [products, totalItems] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        take: safeLimit,
        skip,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => new ProductEntity(p)),
      meta: createPaginationMeta(
        totalItems,
        safePage,
        safeLimit,
        products.length,
      ),
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return new ProductEntity(product);
  }

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;

    return await this.prisma.product.create({
      data: {
        ...productData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const { categoryId, ...updateData } = updateProductDto;

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        category: categoryId
          ? { connect: { id: categoryId } }
          : { disconnect: true },
      },
    });

    return new ProductEntity(updatedProduct);
  }
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
