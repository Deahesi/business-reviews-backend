import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyModel } from '../company/company.model';

export interface CreateReview {
  company_name: string
  review: string
  rating: number
  user_fullname: string
  images?: string[]
  company_id: number
  archive: boolean
}

@Table({ tableName: 'reviews' })
export class ReviewModel extends Model<ReviewModel, CreateReview> {
  @ApiProperty({ example: 1, description: 'Review ID' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'CompanyName', description: 'Company name' })
  @Column({ type: DataType.STRING, allowNull: false })
  company_name: string;

  @ApiProperty({ example: 'Bad company', description: 'User review about company' })
  @Column({
    type: DataType.STRING(5001), unique: false, allowNull: false, validate: {
      len: [10, 5000]
    }
  })
  review: string;

  @ApiProperty({ example: 4.5, description: 'User rating to company' })
  @Column({
    type: DataType.FLOAT, unique: false, allowNull: false, validate: {
      min: 0,
      max: 5
    }
  })
  rating: number;

  @ApiProperty({ example: 'Иван Иванов', description: 'User fullname' })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  user_fullname: string;

  @ApiProperty({
    example: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tripadvisor.ru%2FRestaurant_Review-g298484-d2419130-Reviews-White_Rabbit-Moscow_Central_Russia.html&psig=AOvVaw0Z3HYOBzV8D4Zvr6rCwr9m&ust=1633165198912000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLjwss7sqPMCFQAAAAAdAAAAABAD',
    description: 'Image URL from image hosting'
  })
  @Column({ type: DataType.ARRAY(DataType.STRING), unique: false, allowNull: true })
  images?: string[];

  @ApiProperty({
    example: false,
    description: 'Review archive status'
  })
  @Column({ type: DataType.BOOLEAN, unique: false, allowNull: false })
  archive: boolean;

  @BelongsTo(() => CompanyModel)
  company: CompanyModel;

  @ForeignKey(() => CompanyModel)
  @Column({
    type: DataType.INTEGER
  })
  company_id: number;

  getPublicData(company?: CompanyModel) {
    return {
      id: this.id,
      company_name: this.company_name,
      review: this.review.substring(0, this.review.length <= 214 ? this.review.length - 1 : 214) +  (this.review.length > 214 ? '...' : ''),
      rating: this.rating,
      user_fullname: this.user_fullname,
      images: this.images,
      company_id: this.company_id,
      createdAt: this.createdAt,
      company_city: company ? company.city : undefined,
      company_inn: company ? company.inn : undefined,
      company_rating: company ? company.rating : undefined
    }
  }

  getAdminData(company?: CompanyModel) {
    return {
      id: this.id,
      company_name: this.company_name,
      review: this.review.substring(0, this.review.length <= 214 ? this.review.length - 1 : 214) +  (this.review.length > 214 ? '...' : ''),
      rating: this.rating,
      user_fullname: this.user_fullname,
      images: this.images,
      company_id: this.company_id,
      createdAt: this.createdAt,
      archive: this.archive,
      company_city: company ? company.city : undefined,
      company_rating: company ? company.rating : undefined
    }
  }

  getFullPublicData(company?: CompanyModel) {
    return {
      id: this.id,
      company_name: this.company_name,
      review: this.review,
      rating: this.rating,
      user_fullname: this.user_fullname,
      images: this.images,
      company_id: this.company_id,
      createdAt: this.createdAt,
      company_city: company ? company.city : undefined,
      company_rating: company ? company.rating : undefined,
      company_reviews: company ? company.company_reviews.filter((r) => !r.archive).map((r) => r.getPublicData()) : undefined
    }
  }
}

