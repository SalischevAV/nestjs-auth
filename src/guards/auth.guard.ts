import { UserService } from '@/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException('User is not authorized');
    }
    const user = await this.userService.findUserById(request.session.userId);

    request.user = user;
    return true;
  }
}
