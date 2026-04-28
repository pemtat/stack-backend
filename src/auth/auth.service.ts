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
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByUsername(dto.username);
    if (userExists) throw new BadRequestException('User already exists!');

    const newUser = await this.usersService.create(dto);
    return new UserEntity(newUser);
  }

  async login(username: string, pass: string) {
    const user = await this.usersService.findOneForAuth(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
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
        }),
        refresh_token: token,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
