import { Exclude, Transform } from 'class-transformer';

export class ProductEntity {
  id: number;
  productCode: string;
  name: string;
  @Transform(({ value }) => (value ? Number(value) : 0))
  price: number;
  stock: number;
  unit: string;
  imageUrl?: string | null;
  createdAt: Date;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
