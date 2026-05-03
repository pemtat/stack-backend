import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AppVersionService } from './app-version.service';
import { CheckVersionDto } from './dto/check-version.dto';
import { UpsertVersionDto } from './dto/upsert-version.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('app-version')
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @Get('check')
  checkVersion(@Query() query: CheckVersionDto) {
    return this.appVersionService.checkVersion(query);
  }

  @Get('latest')
  getLatestVersion(@Query('platform') platform: string) {
    return this.appVersionService.getLatestVersion(platform);
  }

  // Use Auth or Admin Guard in a real production scenario
  @UseGuards(JwtAuthGuard)
  @Post()
  upsertVersion(@Body() dto: UpsertVersionDto) {
    return this.appVersionService.upsertVersion(dto);
  }
}
