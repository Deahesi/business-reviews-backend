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
import { CompanyDto } from '../../company/dto/company.dto';

export class CreateReviewDto {
  @IsNumber({}, {message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly company_id: number

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @Length(100, 5000, {message: 'length of this field must be between 100 and 5000'})
  readonly review: string

  @IsNumber({}, {message: 'This field must be integer'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @Max(5, { message: 'Rating must be a number between 0 and 5' })
  @Min(0, { message: 'Rating must be a number between 0 and 5' })
  readonly rating: number

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly user_fullname: string
}

// class CompanyDto {
//   @IsString({message: 'This field must be string'})
//   @IsNotEmpty({message: 'This field cannot be empty'})
//   readonly name: string
//
//   @IsString({message: 'This field must be string'})
//   @IsNotEmpty({message: 'This field cannot be empty'})
//   readonly city: string
//
//   @IsString({message: 'This field must be string'})
//   @IsNotEmpty({message: 'This field cannot be empty'})
//   readonly type: CompanyType
//
//   @IsString({message: 'This field must be string'})
//   @IsOptional()
//   readonly entity?: string
//
//   @IsString({message: 'This field must be string'})
//   @IsOptional()
//   readonly businessmanSurname?: string
//
//   @IsString({message: 'This field must be string'})
//   @IsOptional()
//   readonly inn?: string
//
//   @IsString({message: 'This field must be string'})
//   @IsOptional()
//   readonly ogrn?: string
//
//   @IsString({message: 'This field must be string'})
//   @IsOptional()
//   readonly address?: string
//
//   @IsString({message: 'This field must be string'})
//   @IsOptional()
//   @IsUrl({}, {message: 'Invalid url address'})
//   readonly site?: string
//
//   @IsString({message: 'This field must be string'})
//   @IsOptional()
//   readonly phone?: string
//
//   @IsString({message: 'This field must be string'})
//   @IsEmail({}, {message: 'Invalid email'})
//   @IsOptional()
//   readonly email?: string
// }

export class CreateReviewWithCompanyDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @Length(100, 5000, {message: 'length of this field must be between 100 and 5000'})
  readonly review: string

  @IsNumber({}, {message: 'This field must be integer'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @Max(5, { message: 'Rating must be a number between 0 and 5' })
  @Min(0, { message: 'Rating must be a number between 0 and 5' })
  readonly rating: number

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly user_fullname: string

  @IsDefined({message: 'This field cannot be empty'})
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto
}

export class UploadImageDto {
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly review_id: string //number (Multi-form, no types)

  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly last: string //0 - 1 (Multi-form, no types)
}
