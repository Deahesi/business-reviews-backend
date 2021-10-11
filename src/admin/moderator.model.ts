import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { classToPlain, Exclude } from 'class-transformer';

export interface CreateModerator {
  moderator_name: string
  root: boolean
  email: string
  perm_password?: string
}

@Table({ tableName: 'moderators' })
export class ModeratorModel extends Model<ModeratorModel, CreateModerator> {
  @ApiProperty({ example: 1, description: 'Moderator ID' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: false, description: 'Root status' })
  @Column({ type: DataType.BOOLEAN, unique: false, allowNull: false })
  root: boolean;

  @ApiProperty({ example: 'email@email.com', description: 'Moderator email' })
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @ApiProperty({ example: '', description: 'Root hash password' })
  @Column({ type: DataType.STRING, allowNull: true })
  perm_password: string;

  @ApiProperty({ example: 'Ivan Ivanov', description: 'Moderator name' })
  @Column({ type: DataType.STRING, allowNull: false })
  moderator_name: string

  getUserPublicData() {
    return {
      id: this.id,
      root: this.root,
      email: this.email,
      moderator_name: this.moderator_name
    }
  }
}
