import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
require('dotenv').config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Kiểm tra các biến môi trường
    const clientID = process.env.CLIENT_ID_GG;
    const clientSecret = process.env.CLIENT_SECRET_GG;

    if (!clientID || !clientSecret) {
      throw new Error('Google clientID or clientSecret is not defined');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:5000/api/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    done(null, profile);
  }
}
