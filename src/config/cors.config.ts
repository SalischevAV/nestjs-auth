import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export function getCorsConfig(configService: ConfigService): CorsOptions {
	return {
		origin: configService
			.getOrThrow<string>('HTTP_CORS_ORIGINS')
			.split(','),
		credentials: true,
	};
}
