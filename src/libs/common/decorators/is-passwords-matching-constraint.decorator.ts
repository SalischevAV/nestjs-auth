import { RegisterDto } from '@/dto/Register.dto'
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'



@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint
	implements ValidatorConstraintInterface
{
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as RegisterDto
		return obj.password === passwordRepeat
	}

	public defaultMessage(validationArguments?: ValidationArguments) {
		return 'Passwords are not equal'
	}
}
