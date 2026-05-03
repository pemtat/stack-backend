import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppVersionService } from './app-version.service';
import { CheckVersionDto } from './dto/check-version.dto';
import { UpsertVersionDto } from './dto/upsert-version.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('App Version')
@Controller('app-version')
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @ApiOperation({ summary: 'ตรวจสอบเวอร์ชั่นแอป' })
  @Get('check')
  checkVersion(@Query() query: CheckVersionDto) {
    return this.appVersionService.checkVersion(query);
  }

  @ApiOperation({ summary: 'ดูเวอร์ชั่นล่าสุด' })
  @Get('latest')
  getLatestVersion(@Query('platform') platform: string) {
    return this.appVersionService.getLatestVersion(platform);
  }

  @ApiOperation({ summary: 'ตั้งค่าเวอร์ชั่นแอป (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  upsertVersion(@Body() dto: UpsertVersionDto) {
    return this.appVersionService.upsertVersion(dto);
  }
}
