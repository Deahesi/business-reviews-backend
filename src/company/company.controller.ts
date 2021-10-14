import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { CompanyDto, CompanyExistDto } from './dto/company.dto';
import { CompanyService } from './company.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyModel } from './company.model';
import { SearchCompanyDto } from './dto/search-company.dto';

@ApiTags('Companies')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({summary: 'Create company'})
  @ApiResponse({ status: 201, type: CompanyModel })
  @Post('/create')
  async create(@Body() dto: CompanyDto) {
    return this.companyService.createCompany(dto)
  }

  @ApiOperation({summary: 'Get company by ID'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Get('/:id')
  async getCompanyById(@Param('id') id: number) {
    return this.companyService.getCompanyById(id)
  }

  @ApiOperation({summary: 'Get company by ID'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Post('/exist')
  async checkCompanyExist(@Body() dto: CompanyExistDto) {
    return this.companyService.checkCompanyExist(dto)
  }

  @ApiOperation({summary: 'Search company'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Post('/search')
  async search(@Body() dto: SearchCompanyDto) {
    return this.companyService.searchByQuery(dto)
  }

  @ApiOperation({summary: 'Fast search in input'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Post('/input-search')
  async inputSearch(@Body() dto: Omit<SearchCompanyDto, 'page'>) {
    return this.companyService.searchInput(dto)
  }
}
