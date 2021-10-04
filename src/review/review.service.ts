import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { CompanyService } from '../company/company.service';
import { CompanyModel } from '../company/company.model';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(ReviewModel) private reviewRepository: typeof ReviewModel,
              private companyService: CompanyService) {
  }

  async createReview(dto: CreateReviewDto) {
    let company: CompanyModel
    company = await this.companyService.getCompanyByName(dto.company_name)
    if (!company) {
      company = await this.companyService.createCompany(dto.company)
    }
    const review = await this.reviewRepository.create({ ...dto, company_id: company.id })
    await company.$set('company_reviews', [...await company.$get('company_reviews'), review])

    return review
  }
}
