import { Body, Controller, Get, Injectable, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, CreateReviewWithCompanyDto } from './dto/create-review.dto';

@Controller('review')
export class ReviewController {
  constructor (private readonly reviewService: ReviewService) {
  }

  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return await this.reviewService.createReview(dto)
  }

  @Post('create-with-company')
  async createWithCompany(@Body() dto: CreateReviewWithCompanyDto) {
    return await this.reviewService.createReviewWithCompany(dto)
  }

  @Get('get-last-reviews')
  async getLastReviews(@Query('page') page_number: number) {
    return await this.reviewService.getLastReviews(page_number ?? 1)
  }

  @Get('company/:id')
  async getCompanyReviews(@Param('id') id: number) {
    return await this.reviewService.getCompanyReviews(id ?? 1)
  }

  @Get(':id')
  async getReviewById(@Param('id') id: number) {
    return await this.reviewService.getPageData(id ?? 1)
  }
}
