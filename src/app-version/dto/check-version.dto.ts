import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckVersionDto {
  @IsNotEmpty()
  @IsString()
  platform!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  buildNumber!: number;
}
