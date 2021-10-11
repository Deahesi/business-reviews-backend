import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ModeratorModel } from '../moderator.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET
    });

  }

  async validate(moderator: Pick<ModeratorModel, 'email' | 'moderator_name' | 'id' | 'root'>) {
    return {
      email: moderator.email,
      moderator_name: moderator.moderator_name,
      id: moderator.id,
      root: moderator.root
    }
  }
}
