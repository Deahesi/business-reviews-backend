import { IsNotEmpty, IsString } from 'class-validator';

export class SearchCityDto {
  @IsString({message: 'This field must be string'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly query: string
}
