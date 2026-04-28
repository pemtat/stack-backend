import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  username: string;
  fullName: string | null;
  phoneNumber: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
