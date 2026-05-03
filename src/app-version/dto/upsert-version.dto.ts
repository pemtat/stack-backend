import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertVersionDto {
  @IsNotEmpty()
  @IsString()
  platform!: string;

  @IsNotEmpty()
  @IsString()
  version!: string;

  @IsNotEmpty()
  @IsNumber()
  buildNumber!: number;

  @IsOptional()
  @IsBoolean()
  forceUpdate?: boolean;

  @IsOptional()
  @IsString()
  releaseNotes?: string;
}
