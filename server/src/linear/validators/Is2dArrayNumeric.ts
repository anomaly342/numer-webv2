import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class Is2dArrayNumeric implements ValidatorConstraintInterface {
  validate(nestedArr: number[][], args: ValidationArguments) {
    return (
      Array.isArray(nestedArr) &&
      nestedArr.every(
        (row) => Array.isArray(row) && row.every((e) => typeof e === 'number'),
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return "a is not an array or some elements within it aren't a number.";
  }
}
