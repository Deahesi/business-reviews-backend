import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyModel } from '../company/company.model';

export interface CreateReview {
  company_name: string
  review: string
  rating: string
  user_fullname: string
  image?: string
  company_id: number
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
    type: DataType.STRING, unique: false, allowNull: false, validate: {
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
  rating: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'User fullname' })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  user_fullname: string;

  @ApiProperty({
    example: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tripadvisor.ru%2FRestaurant_Review-g298484-d2419130-Reviews-White_Rabbit-Moscow_Central_Russia.html&psig=AOvVaw0Z3HYOBzV8D4Zvr6rCwr9m&ust=1633165198912000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLjwss7sqPMCFQAAAAAdAAAAABAD',
    description: 'Image URL from image hosting'
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  image?: string;

  @BelongsTo(() => CompanyModel)
  company: CompanyModel;

  @ForeignKey(() => CompanyModel)
  @Column({
    type: DataType.INTEGER
  })
  company_id: number;
}

