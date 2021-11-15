import { Column, DataType } from 'sequelize-typescript';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { CompanyType } from '../company.model';

export class SearchCompanyDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly query: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly city?: string

  @IsNumber({}, {message: 'This field must be integer'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly page: number

  @IsOptional()
  @IsString({message: 'This field must be string'})
  readonly type?: CompanyType
}

export class FastSearchCompanyDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly query: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly city?: string

  @IsOptional()
  @IsString({message: 'This field must be string'})
  readonly type?: CompanyType
}
