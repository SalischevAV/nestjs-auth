import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);
	async onModuleDestroy() {
		this.logger.log('Closing DB connection');
		try {
			await this.$disconnect();
			this.logger.log('DB connection closed');
		} catch (error) {
			this.logger.error(
				'Failed to close connection to the database',
				error as string
			);
			throw error;
		}
	}

	async onModuleInit() {
		this.logger.log('Initializing DB connection');
		try {
			await this.$connect();
			this.logger.log('DB connection established');
		} catch (error) {
			this.logger.error(
				'Failed to connect to the database',
				error as string
			);
			throw error;
		}
	}
}
