import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyModel } from '../company/company.model';

export interface InitCity {
  city: string
}

@Table({ tableName: 'cities' })
export class CityModel extends Model<CityModel, InitCity> {
  @ApiProperty({ example: 1, description: 'City ID' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'Berdsk', description: 'City' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  city: string;

  @HasMany(() => CompanyModel)
  city_companies: CompanyModel[]

  getCity() {
    return this.city
  }
}
