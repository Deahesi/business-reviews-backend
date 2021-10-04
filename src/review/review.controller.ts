import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
export class ReviewController {
  constructor (private readonly reviewService: ReviewService) {
  }

  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return await this.reviewService.createReview(dto)
  }
}
