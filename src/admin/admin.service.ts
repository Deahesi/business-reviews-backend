import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModeratorModel } from './moderator.model';
import { CreateModeratorDto } from './dto/moderator.dto';
import { AlreadyRootException } from '../exceptions/already-root.exception';
import { compare, genSalt, hash } from 'bcryptjs';
import { EmailAlreadyExist } from '../exceptions/unique-email.exception';
import { CreateRootModeratorDto } from './dto/moderator-root.dto';
import { ReviewService } from '../review/review.service';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { CompanyNotfoundException } from '../exceptions/company-notfound.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(@InjectModel(ModeratorModel) private moderatorRepository: typeof ModeratorModel,
              private readonly reviewService: ReviewService,
              private readonly jwtService: JwtService) {
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
    return { ...user.getUserPublicData() };
  }

  async createModerator(dto: CreateModeratorDto) {
    const findEmail = await this.moderatorRepository.findOne({ where: { email: dto.email } });
    if (findEmail) {
      throw new EmailAlreadyExist([{
        field: 'email',
        errors: ['Email already exist']
      }]);
    }

    const user = await this.moderatorRepository.create({ ...dto, root: false });
    return { ...user.getUserPublicData() };
  }

  async deleteReview(dto: DeleteReviewDto) {
    const review = await this.reviewService.findById(dto.id);
    if (!review) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }]);
    }

    await review.destroy();
    return;
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
      // Отправка пароля на почту
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
}
