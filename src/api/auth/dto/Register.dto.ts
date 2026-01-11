import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate,
} from 'class-validator';
import { IsPasswordsMatchingConstraint } from 'libs/decorators';

export class RegisterDto {
	@IsString()
	@IsNotEmpty({ message: 'Name is required' })
	name: string;

	@IsString()
	@IsEmail({}, { message: 'Wrong email format' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@IsString()
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(6, {
		message: 'Min length 6 characters',
	})
	password: string;

	@IsString()
	@IsNotEmpty({ message: 'Password confirmation is required' })
	@MinLength(6, {
		message: 'Min length 6 characters',
	})
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Passwords are not equal',
	})
	passwordRepeat: string;
}
