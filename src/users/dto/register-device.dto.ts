import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsNotEmpty()
  @IsString()
  platform!: string;

  @IsOptional()
  @IsString()
  appVersion?: string;

  @IsOptional()
  @IsNumber()
  buildNumber?: number;

  @IsOptional()
  @IsString()
  deviceModel?: string;

  @IsOptional()
  @IsString()
  pushToken?: string;
}
