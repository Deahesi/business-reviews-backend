import { CompanyDto } from '../../company/dto/company.dto';

export class CreateReviewDto {
  readonly company_name: string
  readonly review: string
  readonly rating: string
  readonly user_fullname: string
  readonly image?: string

  readonly company?: CompanyDto
}
