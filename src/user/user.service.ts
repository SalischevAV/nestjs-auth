import { CreateUserDto } from '@/dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    public async findUserById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }, include: {
                accounts: true
            }
        })
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    public async findUserByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }, include: {
                accounts: true
            }
        })

        // if (!user) {
        //     throw new NotFoundException('User not found');
        // }
        return user;
    }
    public async createUser({
        email,
        password,
        displayName,
        picture,
        method,
        isVerified
    }: CreateUserDto) {
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: password ? await hash(password) : '',
                displayName,
                picture,
                method,
                isVerified
            },
            include : {
                accounts: true
            }
        })
        return user;
     }
}
