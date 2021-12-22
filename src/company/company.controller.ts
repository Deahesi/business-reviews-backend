import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post, Query, UploadedFile,
  UseInterceptors, UsePipes
} from '@nestjs/common';
import {
  BindCompanyDto,
  CompanyDto,
  CompanyExistDto,
  UpdateCompanyDto,
  UploadCompanyImageDto
} from './dto/company.dto';
import { CompanyService } from './company.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyModel } from './company.model';
import { FastSearchCompanyDto, SearchCompanyDto } from './dto/search-company.dto';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImagePipe } from '../pipes/validate-image.pipe';
import { UploadImageDto } from '../review/dto/create-review.dto';

class DadataAddressResponse {
  result: ''
}

@ApiTags('Companies')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({summary: 'Create company'})
  @ApiResponse({ status: 201, type: CompanyModel })
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CompanyDto) {
    return await this.companyService.createCompany(dto)
  }

  @Get('/activities')
  @HttpCode(HttpStatus.OK)
  async getActivities() {
    return this.companyService.getActivities()
  }

  @Get('/search/activity')
  @HttpCode(HttpStatus.OK)
  async getByActivity(@Query('activity') activity) {
    return this.companyService.getByActivity(activity, '1')
  }


  @ApiOperation({summary: 'Add company image'})
  @ApiResponse({ status: 201, type: CompanyModel })
  @Post('/image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(ValidateImagePipe)
  async pushImage(@Body() dto: UploadCompanyImageDto,
                  @UploadedFile() image) {
    return await this.companyService.pushImageToCompany(dto, image)
  }

  @ApiOperation({summary: 'Get company by ID'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getCompanyById(@Param('id') id: number) {
    return await this.companyService.getCompanyPageById(id)
  }

  // @ApiOperation({summary: 'Get company by ID'})
  // @ApiResponse({ status: 202, type: CompanyModel })
  // @Post('/exist')
  // @HttpCode(HttpStatus.OK)
  // async checkCompanyExist(@Body() dto: CompanyExistDto) {
  //   return this.companyService.checkCompanyExist(dto)
  // }

  @ApiOperation({summary: 'Search company'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Post('/search')
  @HttpCode(HttpStatus.OK)
  async search(@Body() dto: SearchCompanyDto) {
    return await this.companyService.searchByQuery(dto)
  }

  @ApiOperation({summary: 'Fast search in input'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Post('/input-search')
  @HttpCode(HttpStatus.OK)
  async inputSearch(@Body() dto: FastSearchCompanyDto) {
    return await this.companyService.searchInput(dto)
  }

  @ApiOperation({summary: 'Bind company'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Post('/bind')
  @HttpCode(HttpStatus.CREATED)
  async bindCompany(@Body() dto: BindCompanyDto) {
    return await this.companyService.bindCompany(dto)
  }

  @ApiOperation({summary: 'Update company'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Patch('/update')
  @HttpCode(HttpStatus.CREATED)
  async updateCompany(@Body() dto: UpdateCompanyDto) {
    return this.companyService.updateCompany(dto)
  }

  // @Post('/dadata/address-confirm')
  // @HttpCode(HttpStatus.OK)
  // async dadataAddress(@Body() dto: string[]): Promise<DadataAddressResponse[]> {
  //   return this.companyService.getDadataAddress(dto)
  // }
}
