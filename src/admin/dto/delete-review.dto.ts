import {
  IsBoolean,
  IsEmail,
  IsNotEmpty, IsNumber,
  IsString
} from 'class-validator';

export class DeleteReviewDto {
  @IsNumber({}, {message: 'This field must be number'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly id: number
}
