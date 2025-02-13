import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from '@/decorators/authorized.decorator';
import { Authorization } from '@/decorators/authorization.decorator';
import { UserRole } from '@prisma/__generated__';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string){
    return this.userService.findUserById(userId)
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('get-by-id/:id')
  public async findById(@Param('id') userId: string){
    return this.userService.findUserById(userId)
  }
}
