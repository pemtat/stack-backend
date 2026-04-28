import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  productCode: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
