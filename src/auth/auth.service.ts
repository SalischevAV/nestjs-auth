import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from '@/dto';
import { UserService } from '@/user/user.service';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthMethod, User } from '@prisma/__generated__';
import { verify } from 'argon2';
import { Request, Response } from 'express'

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly configService: ConfigService) {

    }
    public async register(req: Request, {
        email,
        name,
        password,
        passwordRepeat,
    }: RegisterDto) {
        const candidate = await this.userService.findUserByEmail(email);
        if (candidate) {
            throw new ConflictException('User already exists')
        }
        const newUser = await this.userService.createUser({
            email,
            displayName: name,
            password,
            picture: '',
            method: AuthMethod.CREDENTIALS,
            isVerified: false,
        })

        return this.saveSession(req, newUser);
    }

    public async login(req: Request, { email, password, code }: LoginDto) {
        const user = await this.userService.findUserByEmail(email);

        if (!user || !user.password) {
            throw new NotFoundException('User not found')
        }

        const isPasswordValid = await verify(user.password, password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Wrong password')
        }

        return this.saveSession(req, user);
    }

    public async logout(req: Request, res: Response): Promise<{status: string}> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(new InternalServerErrorException('Failed to close session'));
                }
                res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
            })
            resolve({status: 'logged out'})
        })
    }

    private async saveSession(req: Request, user: User):Promise<{user: User}> {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id;

            req.session.save(err => {
                if (err) {
                    return reject(new InternalServerErrorException('Can not save session'));
                }

                resolve({
                    user
                })
            })
        })
    }
}
