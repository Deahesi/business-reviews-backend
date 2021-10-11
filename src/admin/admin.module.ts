import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ModeratorModel } from './moderator.model';
import { ReviewModule } from '../review/review.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AdminService, JwtStrategy],
  controllers: [AdminController],
  imports: [
    SequelizeModule.forFeature([ModeratorModel]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET
      })
    }),
    PassportModule,
    ReviewModule
  ],
})
export class AdminModule {}
