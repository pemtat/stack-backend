import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createPaginationMeta } from '../common/utils/pagination.util';
import { ProductEntity } from './entities/product.entity';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { NotificationService } from '../notification/notification.service';
@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 20,
    search: string = '',
  ): Promise<PaginatedResponse<ProductEntity>> {
    const safeLimit = Math.min(limit, 100);
    const safePage = Math.max(1, page);
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { productCode: { contains: search, mode: 'insensitive' } },
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
      data: products.map((p) => new ProductEntity(p)),
      meta: createPaginationMeta(
        totalItems,
        safePage,
        safeLimit,
        products.length,
      ),
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return new ProductEntity(product);
  }

  async create(dto: CreateProductDto) {
    const { categoryId, ...data } = dto;
    const product = await this.prisma.product.create({
      data: {
        ...data,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
    });

    // ส่ง Push Notification แจ้งเตือนสินค้าใหม่
    this.notificationService.sendToAllUsers(
      'มีสินค้าใหม่เข้ามาแล้ว! 🎉',
      `พบกับสินค้าใหม่: ${product.name}`,
      { productId: product.id.toString(), route: '/product-detail' }
    ).catch((err) => {
      // ป้องกันไม่ให้ error ของ notification ทำให้การสร้างสินค้าล้มเหลว
      console.error('Failed to send product notification:', err);
    });

    return new ProductEntity(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    const { categoryId, ...data } = dto;
    return new ProductEntity(
      await this.prisma.product.update({
        where: { id },
        data: {
          ...data,
          category: categoryId
            ? { connect: { id: categoryId } }
            : { disconnect: true },
        },
      }),
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return new ProductEntity(
      await this.prisma.product.delete({ where: { id } }),
    );
  }
}
