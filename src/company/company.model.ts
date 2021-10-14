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
  email?: string,
  reviews_count?: number,
  rating?: number
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
    type: DataType.ARRAY(DataType.STRING), unique: false, allowNull: true
  })
  sites?: string[];

  @ApiProperty({ example: '+88888888888', description: 'Company contact phone' })
  @Column({
    type: DataType.ARRAY(DataType.STRING), unique: false, allowNull: true
  })
  phones?: string[];

  @ApiProperty({ example: 'email@emial.email', description: 'Company contact email' })
  @Column({
    type: DataType.ARRAY(DataType.STRING), unique: false, allowNull: true
  })
  emails?: string[];

  @HasMany(() => ReviewModel)
  company_reviews: ReviewModel[]

  @ApiProperty({ example: 15, description: 'Reviews count' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: false })
  reviews_count: number

  @ApiProperty({ example: 3.7, description: 'Company rating' })
  @Column({ type: DataType.FLOAT, unique: false, allowNull: false, validate: {
      min: 0,
      max: 5
    } })
  rating: number

  @ForeignKey(() => CityModel)
  private city_id: number;

  getSearchData() {
    return {
      id: this.id,
      name: this.name,
      city: this.city,
      rating: this.rating,
      reviews_count: this.reviews_count,
      type: this.type
    }
  }

  getFastSearchData() {
    return {
      id: this.id,
      name: this.name,
      city: this.city
    }
  }
}
