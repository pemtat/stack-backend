import { Controller, Patch, Post, Get, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('device')
  registerDevice(@CurrentUser() user: any, @Body() dto: RegisterDeviceDto) {
    return this.usersService.registerDevice(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('devices')
  getDevices(@CurrentUser() user: any) {
    return this.usersService.getDevices(user.id);
  }
}
