import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModeratorModel } from './moderator.model';
import { CreateModeratorDto, DeleteModeratorDto } from './dto/moderator.dto';
import { AlreadyRootException } from '../exceptions/already-root.exception';
import { compare, genSalt, hash } from 'bcryptjs';
import { EmailAlreadyExist } from '../exceptions/unique-email.exception';
import { CreateRootModeratorDto } from './dto/moderator-root.dto';
import { ReviewService } from '../review/review.service';
import { ChangeDataDtoId, ChangeDataDtoSeveralId } from './dto/delete-review.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import {
  DeleteImageAdminDto,
  EditReviewDto,
  UploadCompanyImageAdminDto,
  UploadImageAdminDto
} from './dto/edit-review.dto';
import { EmailService } from '../email/email.service';
import { Cache } from 'cache-manager';
import { ReviewAdminService } from '../review/review.admin.service';
import { SearchAdminDto } from './dto/search-admin.dto';
import { UploadImageDto } from '../review/dto/create-review.dto';
import { CompanyAdminService } from '../company/company.admin.service';
import { CompanyService } from '../company/company.service';
import { BindCompanyDto, CompanyDto, UploadCompanyImageDto } from '../company/dto/company.dto';
import { CompanyAdminDto } from './dto/company.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(ModeratorModel) private moderatorRepository: typeof ModeratorModel,
              private readonly reviewService: ReviewService,
              private readonly jwtService: JwtService,
              private readonly emailService: EmailService,
              private readonly reviewAdminService: ReviewAdminService,
              private readonly companyAdminService: CompanyAdminService,
              private readonly companyService: CompanyService,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  async createRoot(dto: CreateRootModeratorDto) {
    const findRoot = await this.moderatorRepository.findOne({ where: { root: true } });
    if (findRoot) {
      throw new AlreadyRootException([{
        field: 'user',
        errors: ['Root user is already exist']
      }]);
    }

    const hashPassword = await hash(dto.password, await genSalt(10));
    const user = await this.moderatorRepository.create({ ...dto, perm_password: hashPassword, root: true });
    const payload = { email: user.email, moderator_name: user.moderator_name, id: user.id, root: user.root };
    return { ...user.getUserPublicData(), auth_token: await this.jwtService.signAsync(payload) };
  }

  async createModerator(dto: CreateModeratorDto, moderator: ModeratorModel) {
    const root = await this.moderatorRepository.findOne({ where: { email: moderator.email } });
    if (!root) {
      throw new UnauthorizedException([{
        field: 'auth',
        errors: ['Unauthorized']
      }]);
    }
    if (!root.root) {
      throw new UnauthorizedException([{
        field: 'root',
        errors: ['You have no permissions to make that']
      }]);
    }

    const findEmail = await this.moderatorRepository.findOne({ where: { email: dto.email } });
    if (findEmail) {
      throw new EmailAlreadyExist([{
        field: 'email',
        errors: ['Email already exist']
      }]);
    }

    const user = await this.moderatorRepository.create({ ...dto, root: false });
    const payload = { email: user.email, moderator_name: user.moderator_name, id: user.id, root: user.root };
    return { ...user.getUserPublicData(), auth_token: await this.jwtService.signAsync(payload) };
  }

  async deleteModerator(dto: DeleteModeratorDto, moderator: ModeratorModel) {
    const root = await this.moderatorRepository.findOne({ where: { email: moderator.email } });
    if (!root) {
      throw new UnauthorizedException([{
        field: 'auth',
        errors: ['Unauthorized']
      }]);
    }
    if (!root.root) {
      throw new UnauthorizedException([{
        field: 'root',
        errors: ['You have no permissions to make that']
      }]);
    }

    const findEmail = await this.moderatorRepository.findOne({ where: { email: dto.email } });
    if (!findEmail || findEmail.email === root.email) {
      throw new EmailAlreadyExist([{
        field: 'email',
        errors: ['Email didn\'t registered']
      }]);
    }
    await findEmail.destroy()
    return
  }

  async deleteReview(dto: ChangeDataDtoId) {
    const review = await this.reviewAdminService.findByIdAdmin(dto.id);
    await review.destroy();
    await this.companyService.countRatingAndReviews(review.company_id)
    return;
  }

  async toArchiveReview(dto: ChangeDataDtoId) {
    const review = await this.reviewAdminService.updateReviewAdmin(dto.id, { archive: true });
    await this.companyService.countRatingAndReviews(review.company_id)
    return review;
  }

  async fromArchiveReview(dto: ChangeDataDtoId) {
    const review = await this.reviewAdminService.updateReviewAdmin(dto.id, { archive: false });
    await this.companyService.countRatingAndReviews(review.company_id)
    return review;
  }


  async validateEmail(email: string) {
    const user = await this.moderatorRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException([{
        field: 'auth',
        errors: ['Invalid email']
      }]);
    }

    if (!user.root) {
      const pass = Math.floor(50000 + Math.random() * (99999999 + 1 - 50000)).toString();
      const hashPass = await hash(pass, await genSalt(10))
      await this.cacheManager.set(user.email, hashPass, { ttl: 300 });
      await this.emailService.sendMail({
        to: user.email,
        subject: 'Пароль для модератора Бизнес Отзывы',
        text: pass
      });
    }

    return {
      email: user.email
    };
  }

  async findUserByEmail(email: string) {
    const user = await this.moderatorRepository.findOne({ where: { email } });
    return user.getUserPublicData();
  }

  async login(email: string, password: string) {
    const user = await this.moderatorRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException([{
        field: 'auth',
        errors: ['Invalid email or password']
      }]);
    }
    if (user.root) {
      const isCorrectPassword = await compare(password, user.perm_password);
      if (!isCorrectPassword) {
        throw new UnauthorizedException([{
          field: 'auth',
          errors: ['Invalid email or password']
        }]);
      }
    } else {
      const genPass = await this.cacheManager.get(user.email) || '';
      const isCorrectPassword = process.env.NODE_ENV === 'production' ? await compare(password, genPass) : password === '123456';
      if (!isCorrectPassword) {
        throw new UnauthorizedException([{
          field: 'auth',
          errors: ['Invalid email or password']
        }]);
      }
      await this.cacheManager.del(user.email);
    }

    const payload = { email: user.email, moderator_name: user.moderator_name, id: user.id, root: user.root };
    return {
      ...user.getUserPublicData(),
      auth_token: await this.jwtService.signAsync(payload)
    };
  }

  async auth(moderator: ModeratorModel) {
    const user = await this.moderatorRepository.findOne({ where: { email: moderator.email, id: moderator.id } });
    if (!user) {
      throw new UnauthorizedException([{
        field: 'auth',
        errors: ['Invalid auth token']
      }]);
    }
    return user.getUserPublicData();
  }

  async editReview(dto: EditReviewDto) {
    const review = await this.reviewAdminService.updateReviewAdmin(dto.id, {
      review: dto.review,
      rating: dto.rating,
      user_fullname: dto.user_fullname
    });
    return review;
  }


  async searchReviews(dto: SearchAdminDto) {
    return this.reviewAdminService.search(dto)
  }

  async searchArchiveReviews(dto: SearchAdminDto) {
    return this.reviewAdminService.searchArchive(dto)
  }

  async addImageToReview(dto: UploadImageAdminDto, image: any) {
    return this.reviewAdminService.addImageToReviewByAdmin(dto, image)
  }

  async addImageToCompany(dto: UploadCompanyImageAdminDto, image: any) {
    return this.companyAdminService.addImageToCompanyByAdmin(dto, image)
  }

  async deleteImagesFromReview(dto: DeleteImageAdminDto) {
    return this.reviewAdminService.deleteImageToReviewByAdmin(dto)
  }

  async deleteSeveralReview(dto: ChangeDataDtoSeveralId) {
    const reviews = await this.reviewAdminService.findAllByIdsAdmin(dto.ids);
    for (const review of reviews) {
      await review.destroy()
      await this.companyService.countRatingAndReviews(review.company_id)
    }
    return;
  }

  async archiveSeveralReview(dto: ChangeDataDtoSeveralId) {
    const reviews = await this.reviewAdminService.findAllByIdsAdmin(dto.ids);
    for (const review of reviews) {
      await review.update({ archive: true })
      await this.companyService.countRatingAndReviews(review.company_id)
    }
    return;
  }

  async fromArchiveSeveralReview(dto: ChangeDataDtoSeveralId) {
    const reviews = await this.reviewAdminService.findAllByIdsAdmin(dto.ids);
    for (const review of reviews) {
      await review.update({ archive: false })
      await this.companyService.countRatingAndReviews(review.company_id)
    }
    return;
  }

  async getCompany(dto: ChangeDataDtoId) {
    return await this.companyAdminService.getCompany(dto.id)
  }

  async editCompany(dto: CompanyAdminDto) {
    const company = await this.companyAdminService.updateCompanyAdmin(dto);
    return company;
  }

  async deleteCompanyImage(dto: UploadCompanyImageDto) {
    return this.companyAdminService.deleteImageFromCompanyByAdmin(dto)
  }

  async unbindCompany(dto: BindCompanyDto) {
    return this.companyService.unbindCompany(dto)
  }
}
