import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber, IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min, ValidateNested
} from 'class-validator';
import { CompanyModel, CompanyType } from '../../company/company.model';
import { Type } from 'class-transformer';

export class ChangeReviewDto {
  @IsString({message: 'This field must be string'})
  @IsOptional()
  @Length(100, 5000, {message: 'length of this field must be between 100 and 5000'})
  readonly review?: string

  @IsNumber({}, {message: 'This field must be integer'})
  @IsOptional()
  @Max(5, {message: 'This field cannot be more than 5'})
  @Min(0, {message: 'This field cannot be more than 5'})
  readonly rating?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly user_fullname?: string
}
