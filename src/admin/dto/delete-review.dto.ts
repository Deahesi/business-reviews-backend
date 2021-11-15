import {
  IsBoolean,
  IsEmail,
  IsNotEmpty, IsNumber,
  IsString
} from 'class-validator';

export class ChangeDataDtoId {
  @IsNumber({}, {message: 'This field must be number'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly id: number
}

export class ChangeDataDtoSeveralId {
  @IsNumber({}, {message: 'This field must be number', each: true})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly ids: number[]
}
