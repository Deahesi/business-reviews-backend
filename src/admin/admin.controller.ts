import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post, UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { CreateModeratorDto } from './dto/moderator.dto';
import { AdminService } from './admin.service';
import { CreateRootModeratorDto } from './dto/moderator-root.dto';
import { ChangeDataDtoId, ChangeDataDtoSeveralId } from './dto/delete-review.dto';
import { AuthEmailDto } from './dto/auth-email.dto';
import { AuthDto, AuthPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ModeratorData } from '../decorators/moderator-data';
import { ModeratorModel } from './moderator.model';
import { DeleteImageAdminDto, EditReviewDto, UploadImageAdminDto } from './dto/edit-review.dto';
import { SearchAdminDto } from './dto/search-admin.dto';
import { ReviewAdminService } from '../review/review.admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImagePipe } from '../pipes/validate-image.pipe';
import { UploadImageDto } from '../review/dto/create-review.dto';
import { BindCompanyDto, CompanyDto, UploadCompanyImageDto } from '../company/dto/company.dto';
import { CompanyAdminDto } from './dto/company.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompanyModel } from '../company/company.model';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {
  }

  @Post('register-root')
  async registerRootUser(@Body() dto: CreateRootModeratorDto) {
    return await this.adminService.createRoot(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerUser(@Body() dto: CreateModeratorDto, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.createModerator(dto, moderator);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search/reviews')
  async searchReviews(@Body() dto: SearchAdminDto, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.searchReviews(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search/reviews/archive')
  async searchArchiveReviews(@Body() dto: SearchAdminDto, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.searchArchiveReviews(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-review')
  async deleteReview(@Body() dto: ChangeDataDtoId, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.deleteReview(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-review/several')
  async deleteSeveralReviews(@Body() dto: ChangeDataDtoSeveralId, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.deleteSeveralReview(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit-review')
  async editReview(@Body() dto: EditReviewDto, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.editReview(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit-company')
  async editCompany(@Body() dto: CompanyAdminDto, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.editCompany(dto);
  }

  @Post('review/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(ValidateImagePipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async uploadImage(@Body() dto: UploadImageAdminDto,
                    @UploadedFile() image) {
    return await this.adminService.addImageToReview(dto, image);

  }

  @ApiOperation({summary: 'Unbind company'})
  @ApiResponse({ status: 202, type: CompanyModel })
  @Post('/unbind')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async unbindCompany(@Body() dto: BindCompanyDto) {
    return this.adminService.unbindCompany(dto)
  }

  @Post('review/delete-images')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteImages(@Body() dto: DeleteImageAdminDto) {
    return await this.adminService.deleteImagesFromReview(dto);
  }

  @Post('company/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(ValidateImagePipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async uploadCompanyImage(@Body() dto: UploadCompanyImageDto,
                    @UploadedFile() image) {
    return await this.adminService.addImageToCompany(dto, image);
  }
  @Post('company/delete-image')
  @HttpCode(HttpStatus.CREATED)
  async deleteCompanyImage(@Body() dto: UploadCompanyImageDto) {
    return await this.adminService.deleteCompanyImage(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('archive-review')
  async archiveReview(@Body() dto: ChangeDataDtoId, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.toArchiveReview(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('unarchive-review')
  async unarchiveReview(@Body() dto: ChangeDataDtoId, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.fromArchiveReview(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('company')
  async getCompany(@Body() dto: ChangeDataDtoId, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.getCompany(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('archive-review/several')
  async archiveSeveralReviews(@Body() dto: ChangeDataDtoSeveralId, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.archiveSeveralReview(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('unarchive-review/several')
  async unarchiveSeveralReviews(@Body() dto: ChangeDataDtoSeveralId, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.fromArchiveSeveralReview(dto);
  }

  @Post('login/email')
  async loginStepEmail(@Body() dto: AuthEmailDto) {
    return await this.adminService.validateEmail(dto.email);
  }

  @Post('login/sign')
  async loginStepPassword(@Body() dto: AuthPasswordDto) {
    return await this.adminService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth')
  async auth(@ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.auth(moderator);
  }
}
