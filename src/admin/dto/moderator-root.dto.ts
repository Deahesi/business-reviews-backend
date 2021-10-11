import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateRootModeratorDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly moderator_name: string

  @IsString({message: 'This field must be string'})
  @IsEmail({}, {message: 'Invalid email'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly email: string

  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly password: string
}
