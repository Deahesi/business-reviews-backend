import { Column, DataType } from 'sequelize-typescript';
import { CompanyType } from '../company.model';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsArray({message: 'This field must be array'})
  @IsOptional()
  @IsUrl({}, {message: 'Invalid url address', each: true})
  @IsString({ each: true, message: 'Each element must be string' })
  readonly sites?: string[]

  @IsString({ each: true, message: 'Each element must be string' })
  @IsArray({message: 'This field must be array'})
  @IsOptional()
  readonly phones?: string[]

  @IsString({ each: true, message: 'Each element must be string' })
  @IsArray({message: 'This field must be array'})
  @IsEmail({}, {message: 'Invalid email', each: true})
  @IsOptional()
  readonly emails?: string[]
}

export class CompanyExistDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly name: string
}
