import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { VerifyCallback } from 'passport-google-oauth20';
require('dotenv').config();

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    // Kiểm tra và ném lỗi nếu các biến môi trường không có giá trị
    const clientID = process.env.CLIENT_ID_FB;
    const clientSecret = process.env.CLIENT_SECRET_FB;

    if (!clientID || !clientSecret) {
      throw new Error('Facebook clientID or clientSecret is not defined');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:5000/api/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    return profile;
  }
}
