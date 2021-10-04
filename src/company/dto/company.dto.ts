import { Column, DataType } from 'sequelize-typescript';
import { CompanyType } from '../company.model';

export class CompanyDto {
  readonly name: string
  readonly city: string
  readonly type: CompanyType
  readonly entity?: string
  readonly businessmanSurname?: string
  readonly inn?: string
  readonly ogrn?: string
  readonly address?: string
  readonly site?: string
  readonly phone?: string
  readonly email?: string
}
