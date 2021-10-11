import { Injectable, UsePipes } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';
import { CreateReviewDto, CreateReviewWithCompanyDto } from './dto/create-review.dto';
import { CompanyService } from '../company/company.service';
import { CompanyModel } from '../company/company.model';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CompanyNotfoundException } from '../exceptions/company-notfound.exception';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(ReviewModel) private reviewRepository: typeof ReviewModel,
              private companyService: CompanyService) {
  }

  async createReview(dto: CreateReviewDto) {
    let company: CompanyModel
    company = await this.companyService.getCompanyByName(dto.company_name)
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No company with this name!']
      }])
    }
    const review = await this.reviewRepository.create({ ...dto, company_id: company.id })
    await company.$set('company_reviews', [...await company.$get('company_reviews'), review])

    return review
  }

  async findById(id: number) {
    const review = await this.reviewRepository.findByPk(id)
    if (!review) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }])
    }
    return review
  }

  async getLastReviews(page_number: number) {
    if (page_number < 1) {
      throw new ValidationException([{
        field: 'page_number',
        errors: ['Invalid page number']
      }])
    }
    const reviews = await this.reviewRepository.findAll({ limit: 5, offset: (page_number - 1) * 5, order: [['createdAt', 'DESC']] })
    return reviews
  }

  async createReviewWithCompany(dto: CreateReviewWithCompanyDto) {
    const company = await this.companyService.createCompany(dto.company)
    const review = await this.reviewRepository.create({ ...dto, company_id: company.id })
    return review
  }
}
