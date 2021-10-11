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

export class CreateReviewDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly company_name: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @Length(15, 5000, {message: 'length of this field must be between 15 and 5000'})
  readonly review: string

  @IsNumber({}, {message: 'This field must be Integer'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @Max(5, {message: 'This field cannot be more than 5'})
  @Min(0, {message: 'This field cannot be more than 5'})
  readonly rating: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly user_fullname: string

  @IsOptional()
  readonly image?: string
}

class CompanyDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly name: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly city: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly type: CompanyType

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly entity?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly businessmanSurname?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly inn?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly ogrn?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly address?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  @IsUrl({}, {message: 'Invalid url address'})
  readonly site?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly phone?: string

  @IsString({message: 'This field must be string'})
  @IsEmail({}, {message: 'Invalid email'})
  @IsOptional()
  readonly email?: string
}

export class CreateReviewWithCompanyDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly company_name: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @Length(15, 5000, {message: 'length of this field must be between 15 and 5000'})
  readonly review: string

  @IsNumber({}, {message: 'This field must be Integer'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @Max(5, {message: 'This field cannot be more than 5'})
  @Min(0, {message: 'This field cannot be more than 5'})
  readonly rating: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly user_fullname: string

  @IsOptional()
  readonly image?: string

  @IsDefined({message: 'This field cannot be empty'})
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto
}
