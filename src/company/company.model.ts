import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewModel } from '../review/review.model';
import { CityModel } from '../city/city.model';

export interface CreateCompany {
  name: string
  city: string
  type: CompanyType
  entity?: string
  businessmanSurname?: string
  inn?: string
  ogrn?: string
  address?: string
  site?: string
  phone?: string
  email?: string
}

export type CompanyType = 'company' | 'brand' | 'site' | 'school'

export interface Director {
  position: string
  fullname: string
}


@Table({ tableName: 'companies' })
export class CompanyModel extends Model<CompanyModel, CreateCompany> {
  @ApiProperty({ example: 1, description: 'Company ID' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'CompanyName', description: 'Company name' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @BelongsTo(() => CityModel)
  _city: CityModel;


  @ApiProperty({ example: 'Moscow', description: 'Company main city' })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  city: string;

  @ApiProperty({ example: 'site', description: 'Company type. Can only accept values between |company|brand|site|school|' })
  @Column({ type: DataType.STRING, unique: false })
  type: CompanyType;

  @ApiProperty({ example: 'ООО “Единая Россия”', description: 'Company entity' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  entity?: string;

  @ApiProperty({ example: 'Иванов', description: 'Company businessman surname' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  businessmanSurname?: string;

  @ApiProperty({ example: '100000000000', description: 'Company tax identification number ИНН' })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  inn?: string;

  @ApiProperty({ example: '1000000000000', description: 'Company ogrn ОГРН' })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  ogrn?: string;

  @ApiProperty({ example: 'New York st. Wall', description: 'Company address' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  address?: string;

  @ApiProperty({ example: 'https://site.site', description: 'Company site' })
  @Column({
    type: DataType.STRING, unique: false, allowNull: true, validate: {
      isUrl: true
    }
  })
  site?: string;

  @ApiProperty({ example: '+88888888888', description: 'Company contact phone' })
  @Column({
    type: DataType.STRING, unique: false, allowNull: true, validate: {
      len: [2, 30]
    }
  })
  phone?: string;

  @ApiProperty({ example: 'email@emial.email', description: 'Company contact email' })
  @Column({
    type: DataType.STRING, unique: true, allowNull: true, validate: {
      isEmail: true
    }
  })
  email?: string;

  @HasMany(() => ReviewModel)
  company_reviews: ReviewModel[]

  @ForeignKey(() => CityModel)
  private city_id: number;
}
