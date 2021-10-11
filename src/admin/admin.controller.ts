import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CreateModeratorDto } from './dto/moderator.dto';
import { AdminService } from './admin.service';
import { CreateRootModeratorDto } from './dto/moderator-root.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { AuthEmailDto } from './dto/auth-email.dto';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ModeratorData } from '../decorators/moderator-data';
import { ModeratorModel } from './moderator.model';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {
  }

  @Post('register-root')
  async registerRootUser(@Body() dto: CreateRootModeratorDto) {
    return await this.adminService.createRoot(dto);
  }

  @Post('register')
  async registerUser(@Body() dto: CreateModeratorDto) {
    return await this.adminService.createModerator(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-review')
  async deleteReview(@Body() dto: DeleteReviewDto, @ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.deleteReview(dto);
  }

  @Post('login/email')
  async loginStepEmail(@Body() dto: AuthEmailDto) {
    return await this.adminService.validateEmail(dto.email);
  }

  @Post('login/sign')
  async loginStepPassword(@Body() dto: AuthDto) {
    return await this.adminService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth')
  async auth(@ModeratorData() moderator: ModeratorModel) {
    return await this.adminService.auth(moderator);
  }
}
