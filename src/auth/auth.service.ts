import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/entities/user.entity';
import { APP_CONSTANTS } from '../common/constants/app.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findOneForAuth(dto.username);
    if (existing) throw new BadRequestException('User already exists');

    const newUser = await this.usersService.create(dto);
    return new UserEntity(newUser);
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findOneForAuth(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: APP_CONSTANTS.JWT.ACCESS_EXPIRES_IN,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: APP_CONSTANTS.JWT.REFRESH_EXPIRES_IN,
      }),
      user: new UserEntity(user),
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOneForAuth(payload.username);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User is inactive or not found');
      }

      const newPayload = {
        sub: user.id,
        username: user.username,
        role: user.role,
      };

      return {
        access_token: await this.jwtService.signAsync(newPayload, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: APP_CONSTANTS.JWT.ACCESS_EXPIRES_IN,
        }),
        refresh_token: token,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
