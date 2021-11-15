import { Column, DataType } from 'sequelize-typescript';
import { CompanyModel, CompanyType } from '../company.model';
import { IsArray, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly name: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly city: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  @IsIn(['company', 'brand', 'site', 'school'])
  readonly type: CompanyType

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly entity?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly businessman_fullname?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly director_fullname?: string;

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly director_position?: string;

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly kpp?: string;

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
  readonly tax_authority?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly activity?: string

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

  @IsString({ message: 'This field must be string' })
  @IsOptional()
  readonly createdAt?: string

  @IsNumber({}, { message: 'This field must be number' })
  @IsOptional()
  readonly capital?: number

  @IsString({ message: 'This field must be string' })
  @IsOptional()
  readonly director_date?: string
}

export class CompanyExistDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly name: string
}

export class BindCompanyDto {
  @IsNumber({}, { message: 'his field must be number' })
  @IsNotEmpty({message: 'This field cannot be empty'})
  company1_id: number

  @IsNumber({}, { message: 'his field must be number' })
  @IsNotEmpty({message: 'This field cannot be empty'})
  company2_id: number
}

export class UpdateCompanyDto {
  static transformUpdateData(dto: UpdateCompanyDto, company: CompanyModel) {
    return {
      company_id: dto.company_id,
      inn: company.inn ?? (dto.inn || null),
      address: company.address ?? (dto.address || null),
      emails: dto.emails || [],
      entity: company.entity ?? (dto.entity || null),
      ogrn: company.ogrn ?? (dto.ogrn || null),
      sites: dto.sites || [],
      businessman_fullname: company.businessman_fullname ?? (dto.businessman_fullname || null),
      director_fullname: company.director_fullname ?? (dto.director_fullname || null),
      director_position: company.director_position ?? (dto.director_position || null),
      kpp: company.kpp ?? (dto.kpp || null),
      phones: dto.phones || [],
      tax_authority: company.tax_authority ?? (dto.tax_authority || null),
      activity: company.activity ?? (dto.activity || null),
      capital: company.capital ?? (dto.capital || null),
      director_date: company.director_date ?? (dto.director_date || null)
    }
  }

  @IsNumber({}, { message: 'his field must be number' })
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly company_id: number

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly entity?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly businessman_fullname?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly director_fullname?: string;

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly director_position?: string;

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly kpp?: string;

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
  readonly tax_authority?: string

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly activity?: string

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

  @IsNumber({}, { message: 'This field must be number' })
  @IsOptional()
  readonly capital?: number

  @IsString({ message: 'This field must be string' })
  @IsOptional()
  readonly director_date?: string
}



export class UploadCompanyImageDto {
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly company_id: string //number (Multi-form, no types)
}
