import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['email', 'profile'],
      prompt: 'select_account',
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      let user = await this.authService.findUserById(profile._json.sub);
      if (!user) {
        const picturePath = await this.authService.saveImage(
          profile._json.given_name,
          profile._json.picture,
        );
        user = await this.authService.createUser(
          profile._json.sub,
          profile._json.email,
          profile._json.given_name,
          picturePath,
        );
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
}
