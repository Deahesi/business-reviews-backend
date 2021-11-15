import {
  IsBoolean,
  IsEmail,
  IsNotEmpty, IsNumber, IsOptional,
  IsString, Length
} from 'class-validator';

export class EditReviewDto {
  @IsNumber({}, {message: 'This field must be number'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly id: number

  @IsString({message: 'This field must be string'})
  @IsOptional()
  @Length(100, 5000, {message: 'length of this field must be between 100 and 5000'})
  readonly review?: string

  @IsNumber({}, {message: 'This field must be integer'})
  @IsOptional()
  readonly rating?: number

  @IsString({message: 'This field must be string'})
  @IsOptional()
  readonly user_fullname?: string
}

export class DeleteImageAdminDto {
  @IsNumber({}, {message: 'This field must be number'})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly review_id: number

  @IsString({message: 'This field must be string', each: true})
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly image_urls: string[]
}

export class UploadImageAdminDto {
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly review_id: string //number (Multi-form, no types)
}

export class UploadCompanyImageAdminDto {
  @IsNotEmpty({message: 'This field cannot be empty'})
  readonly company_id: string //number (Multi-form, no types)
}
