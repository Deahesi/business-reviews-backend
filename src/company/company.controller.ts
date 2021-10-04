import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { CompanyDto } from './dto/company.dto';
import { CompanyService } from './company.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyModel } from './company.model';

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
}
