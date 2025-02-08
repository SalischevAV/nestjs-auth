import { AuthMethod } from '@prisma/__generated__';
import { IsBoolean, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  displayName: string;

  // @IsNotEmpty()
  picture: string;

  @IsNotEmpty()
  method: AuthMethod;

  @IsBoolean()
  isVerified: boolean
}

