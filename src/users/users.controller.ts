import { Controller, Patch, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'แก้ไขโปรไฟล์' })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @ApiOperation({ summary: 'เปลี่ยนรหัสผ่าน' })
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto);
  }

  @ApiOperation({ summary: 'ลงทะเบียน/อัปเดตอุปกรณ์' })
  @UseGuards(JwtAuthGuard)
  @Post('device')
  registerDevice(@CurrentUser() user: any, @Body() dto: RegisterDeviceDto) {
    return this.usersService.registerDevice(user.id, dto);
  }

  @ApiOperation({ summary: 'ดูอุปกรณ์ทั้งหมดของตัวเอง' })
  @UseGuards(JwtAuthGuard)
  @Get('devices')
  getDevices(@CurrentUser() user: any) {
    return this.usersService.getDevices(user.id);
  }
}
