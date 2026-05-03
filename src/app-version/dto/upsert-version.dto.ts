import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertVersionDto {
  @ApiProperty({ example: 'android', description: 'ios or android' })
  @IsNotEmpty()
  @IsString()
  platform!: string;

  @ApiProperty({ example: '1.0.0', description: 'Version string' })
  @IsNotEmpty()
  @IsString()
  version!: string;

  @ApiProperty({ example: 10, description: 'Build number' })
  @IsNotEmpty()
  @IsNumber()
  buildNumber!: number;

  @ApiProperty({ example: false, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  forceUpdate?: boolean;

  @ApiProperty({ example: 'Bug fixes', required: false })
  @IsOptional()
  @IsString()
  releaseNotes?: string;
}
