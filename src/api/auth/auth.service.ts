import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'infra/prisma/prisma.service';
import { ms, StringValue } from 'libs/utils';

import { RegisterDto } from './dto';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
	private readonly JWT_REFRESH_TOKEN_TTL: StringValue;

	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
		this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<StringValue>(
			'JWT_ACCESS_TOKEN_TTL'
		);
		this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<StringValue>(
			'JWT_REFRESH_TOKEN_TTL'
		);
	}
	public async registerUser({ email, password, name }: RegisterDto) {
		const candidate = await this.prismaService.user.findUnique({
			where: { email },
		});
		if (candidate) {
			throw new ConflictException('Email already registered');
		} else {
			try {
				const newUser = await this.prismaService.user.create({
					data: {
						email,
						password: await hash(password),
						name,
					},
				});
				const { accessToken, refreshToken, refreshTokenExpires } =
					await this.generateTokens(newUser);
				await this.prismaService.user.update({
					where: { id: newUser.id },
					data: { accessToken, refreshToken },
				});
				return { accessToken, refreshToken, refreshTokenExpires };
			} catch (error) {
				this.logger.error(error);
				throw InternalServerErrorException;
			}
		}
	}
	public async loginUser() {}
	public async logoutUser() {}

	private async generateTokens({ id }: User) {
		const payload: JwtPayload = {
			id,
		};
		const refreshTokenExpires = new Date(
			Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL)
		);
		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL,
		});
		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL,
		});

		return {
			accessToken,
			refreshToken,
			refreshTokenExpires,
		};
	}
}
