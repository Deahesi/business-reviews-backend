import { Injectable, UsePipes } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';
import { CreateReviewDto, CreateReviewWithCompanyDto } from './dto/create-review.dto';
import { CompanyService } from '../company/company.service';
import { CompanyModel } from '../company/company.model';
import { CompanyNotfoundException } from '../exceptions/company-notfound.exception';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(ReviewModel) private reviewRepository: typeof ReviewModel,
              private companyService: CompanyService) {
  }

  async createReview(dto: CreateReviewDto) {
    let company: CompanyModel
    company = await this.companyService.getCompanyByName(dto.company_name, true)
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No company with this name!']
      }])
    }
    const review = await this.reviewRepository.create({ ...dto, company_id: company.id })
    const company_reviews = await company.$get('company_reviews')
    let company_rating = 0
    for (const r of company_reviews) company_rating += r.rating
    company_rating = company_rating / company_reviews.length
    await company.update({
      reviews_count: company_reviews.length,
      rating: company_rating
    })

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

  async getPageData(id: number) {
    const review = await this.reviewRepository.findByPk(id)
    if (!review) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }])
    }
    const reviews = (await this.companyService.getCompanyById(review.company_id)).company_reviews
    return { ...review.toJSON(), other_reviews: [...reviews.splice(reviews.findIndex((r) => r.id === review.id), 1)] }
  }

  async getLastReviews(page_number: number) {
    if (page_number < 1) {
      throw new ValidationException([{
        field: 'page_number',
        errors: ['Invalid page number']
      }])
    }
    const reviews = await this.reviewRepository.findAll({ limit: 5, offset: (page_number - 1) * 5, order: [['createdAt', 'DESC']], include: [{ model: CompanyModel }] })
    return reviews
  }

  async createReviewWithCompany(dto: CreateReviewWithCompanyDto) {
    const company = await this.companyService.createCompany({ ...dto.company })
    const review = await this.createReview(dto)
    return review
  }

  async getCompanyReviews(id: number) {
    const company = await this.companyService.getCompanyById(id)
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No companies with this id']
      }])
    }
    const reviews = await this.reviewRepository.findAll({ where: { company_id: id } })
    return reviews
  }
}
