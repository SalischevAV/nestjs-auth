import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/__generated__';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit{
    public async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
    public async onModuleInit(): Promise<void> {
        await this.$connect();
    }
}
