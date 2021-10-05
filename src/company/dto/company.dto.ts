import { Column, DataType } from 'sequelize-typescript';
import { CompanyType } from '../company.model';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CompanyDto {
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

export class CompanyExistDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly name: string
}