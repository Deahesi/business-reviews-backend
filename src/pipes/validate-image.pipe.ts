import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';


@Injectable()
export class ValidateImagePipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!value.buffer) return value
    const errors = await this.validateImage(value);

    if (errors) {
      throw new ValidationException(errors);
    }
    return value
  }

  private validateImage(image: any): Array<any> | null {
    const _validFileExtensions = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
    return _validFileExtensions.find((extension) => extension === image.mimetype) ? null : [{
      field: 'image',
      errors: ['Image extension can be only .jpg, .jpeg, .gif, .png']
    }]
  }
}
