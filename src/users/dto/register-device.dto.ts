import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'android', description: 'ios or android' })
  @IsNotEmpty()
  @IsString()
  platform!: string;

  @ApiProperty({ example: '1.0.0', required: false })
  @IsOptional()
  @IsString()
  appVersion?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  buildNumber?: number;

  @ApiProperty({ example: 'Samsung Galaxy S24', required: false })
  @IsOptional()
  @IsString()
  deviceModel?: string;

  @ApiProperty({ example: 'fcm-token-string', required: false })
  @IsOptional()
  @IsString()
  pushToken?: string;
}
