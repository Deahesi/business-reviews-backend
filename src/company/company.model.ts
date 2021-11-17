import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewModel } from '../review/review.model';
import { CityModel } from '../city/city.model';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class RelatedCompany {
  name: string
  id: number
  city: string
  type: CompanyType
  rating: number
  reviews_count: number
}

export interface CreateCompany {
  name: string
  city: string
  type: CompanyType
  entity?: string
  businessman_fullname?: string
  director_fullname?: string
  director_position?: string
  kpp?: string
  inn?: string
  ogrn?: string
  address?: string
  site?: string
  phone?: string
  email?: string
  tax_authority?: string
  activity?: string
  reviews_count?: number
  rating?: number,
  createdAt?: string
  capital?: number
  director_date?: string
  related_companies: RelatedCompany[]
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
  @Column({ type: DataType.STRING(1000), unique: false, allowNull: false })
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
  @Column({ type: DataType.STRING(1500), unique: false, allowNull: true })
  entity?: string;

  @ApiProperty({ example: 'ИП Иванов', description: 'Company businessman fullname' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  businessman_fullname?: string;

  @ApiProperty({ example: 'Иванов', description: 'Company director full' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  director_fullname?: string;

  @ApiProperty({ example: 'Директор', description: 'Company director position' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  director_position?: string;

  @ApiProperty({ example: '100000000000', description: 'Company tax identification number ИНН' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  inn?: string;

  @ApiProperty({ example: '100000000000', description: 'Company identification number КПП' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  kpp?: string;

  @ApiProperty({ example: '1000000000000', description: 'Company ogrn ОГРН' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  ogrn?: string;

  @ApiProperty({ example: 'New York st. Wall', description: 'Company address' })
  @Column({ type: DataType.STRING(1000), unique: false, allowNull: true })
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

  @ApiProperty({ example: '', description: 'Company tax authority' })
  @Column({ type: DataType.STRING(1000), unique: false, allowNull: true })
  tax_authority?: string;

  @ApiProperty({ example: '', description: 'Company activity' })
  @Column({ type: DataType.STRING(1000), unique: false, allowNull: true })
  activity?: string;

  @HasMany(() => ReviewModel)
  company_reviews: ReviewModel[]

  @ApiProperty({ example: 15, description: 'Reviews count' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  reviews_count: number

  @ApiProperty({ example: 3.7, description: 'Company rating' })
  @Column({ type: DataType.FLOAT, unique: false, allowNull: true, validate: {
      min: 0,
      max: 5
    } })
  rating: number

  @ApiProperty({ example: 3.7, description: 'Company capital' })
  @Column({ type: DataType.FLOAT, unique: false, allowNull: true })
  capital?: number

  @ApiProperty({ example: '', description: 'Company director pick date' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  director_date?: string

  @ApiProperty({ example: '', description: 'Company image' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  image: string

  @ForeignKey(() => CityModel)
  private city_id: number;

  @Column({ type: DataType.ARRAY(DataType.JSON), unique: false, allowNull: false })
  // @Type(() => RelatedCompany)
  related_companies: RelatedCompany[]

  getSearchData() {
    return {
      id: this.id,
      name: this.name,
      city: this.city,
      rating: this.rating,
      reviews_count: this.reviews_count,
      inn: this.inn,
      image: this.image,
      address: this.address,
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

  getAdminSearchData() {
    return this.company_reviews.map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
      rating: r.rating,
      company_rating: this.rating,
      company_name: this.name,
      company_id: this.id,
      images: r.images,
      company_address: this.address,
      company_type: this.type,
      company_inn: this.inn,
      archive: r.archive
    }))
  }
}
