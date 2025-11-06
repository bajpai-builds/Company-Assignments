import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPasswordMatch(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPasswordMatch',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          return value === object.password;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Passwords do not match';
        },
      },
    });
  };
} 