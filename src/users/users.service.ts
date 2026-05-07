import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';
import * as bcrypt from 'bcrypt';
import { APP_CONSTANTS } from '../common/constants/app.constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException(`User "${username}" not found`);
    return new UserEntity(user);
  }

  async findOneForAuth(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      data.password,
      APP_CONSTANTS.BCRYPT_SALT_ROUNDS,
    );
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    return new UserEntity(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(
      dto.newPassword,
      APP_CONSTANTS.BCRYPT_SALT_ROUNDS,
    );
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async registerDevice(userId: string, dto: RegisterDeviceDto) {
    return this.prisma.userDevice.upsert({
      where: {
        userId_platform: { userId, platform: dto.platform },
      },
      update: {
        appVersion: dto.appVersion,
        buildNumber: dto.buildNumber,
        deviceModel: dto.deviceModel,
        pushToken: dto.pushToken,
        lastActiveAt: new Date(),
      },
      create: {
        userId,
        platform: dto.platform,
        appVersion: dto.appVersion,
        buildNumber: dto.buildNumber,
        deviceModel: dto.deviceModel,
        pushToken: dto.pushToken,
      },
    });
  }

  async getDevices(userId: string) {
    return this.prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastActiveAt: 'desc' },
    });
  }
}
