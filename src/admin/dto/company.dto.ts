import { IsArray, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { CompanyType } from '../../company/company.model';

export class CompanyAdminDto {
  @IsNumber({}, {message: 'This field must be integer'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly id: number

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
