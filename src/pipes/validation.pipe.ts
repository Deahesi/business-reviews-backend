import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = this.transformErrors(errors).flat()
      throw new ValidationException(messages);
    }
    return value
  }

  private transformErrors(errors) {
    return errors.map(err => {
      if (err.children.length) {
        return this.transformErrors(err.children)
      }
      const returnErrors = {
        field: err.property,
        errors: Object.values(err.constraints || {})
      }
      return returnErrors
    });
  }
}
