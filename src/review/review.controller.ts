import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, CreateReviewWithCompanyDto, UploadImageDto } from './dto/create-review.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImagePipe } from '../pipes/validate-image.pipe';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateReviewDto) {
    return await this.reviewService.createReview(dto);
  }

  @Post('create-with-company')
  @HttpCode(HttpStatus.CREATED)
  async createWithCompany(@Body() dto: CreateReviewWithCompanyDto) {
    return await this.reviewService.createReviewWithCompany(dto);
  }

  @Get('get-last-reviews')
  @HttpCode(HttpStatus.CREATED)
  async getLastReviews(@Query('page') page_number: number) {
    return await this.reviewService.getLastReviews(page_number ?? 1);
  }

  @Get('company/:id')
  @HttpCode(HttpStatus.CREATED)
  async getCompanyReviews(@Param('id') id: number) {
    return await this.reviewService.getCompanyReviews(id ?? 1);
  }

  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  async getReviewById(@Param('id') id: number) {
    return await this.reviewService.getPageData(id ?? -1);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(ValidateImagePipe)
  @HttpCode(HttpStatus.CREATED)
  async uploadImage(@Body() dto: UploadImageDto,
                    @UploadedFile() image) {
    return await this.reviewService.uploadImage(dto, image);
  }
}
