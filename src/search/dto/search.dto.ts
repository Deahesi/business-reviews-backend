import { Column, DataType } from 'sequelize-typescript';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { CompanyType } from '../../company/company.model';

export class SearchDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly query: string

  @IsOptional()
  @IsString({message: 'This field must be string'})
  readonly city?: string

  @IsOptional()
  @IsString({message: 'This field must be string'})
  readonly type?: CompanyType
}
