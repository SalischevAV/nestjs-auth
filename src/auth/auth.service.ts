import { RegisterDto } from '@/dto/Register.dto';
import { UserService } from '@/user/user.service';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthMethod, User } from '@prisma/__generated__';
import { Request, Response } from 'express'

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {

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

    public async login() { }

    public async logout() { }
    private async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id;

            req.session.save(err => {
                if(err){
                    return reject(new InternalServerErrorException('Can not save session'))
                }

                resolve({
                    user
                })
            })
        })
     }
}
