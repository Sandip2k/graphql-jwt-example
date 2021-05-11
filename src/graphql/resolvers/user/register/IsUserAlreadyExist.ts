import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { User } from "../../../../models/User";

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
    implements ValidatorConstraintInterface
{
    validate(email: string): boolean | Promise<boolean> {
        return User.findOne({ where: { email } }).then((user) => {
            if (user) return false;
            return true;
        });
    }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint,
        });
    };
}
