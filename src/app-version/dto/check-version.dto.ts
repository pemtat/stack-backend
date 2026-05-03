import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CheckVersionDto {
  @ApiProperty({ example: 'android', description: 'ios or android' })
  @IsNotEmpty()
  @IsString()
  platform!: string;

  @ApiProperty({ example: 10, description: 'Current build number of the app' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  buildNumber!: number;
}
