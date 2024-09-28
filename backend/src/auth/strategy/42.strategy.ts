import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('_42_CLIENT_ID'),
      clientSecret: configService.get('_42_CLIENT_SECRET'),
      callbackURL: configService.get('_42_CALLBACK_URL'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    try {
      let user = await this.authService.findUserById(
        profile._json.id.toString(),
      );
      if (!user) {
        const picturePath = await this.authService.saveImage(
          profile.username,
          profile._json.image.link,
        );
        user = await this.authService.createUser(
          profile._json.id.toString(),
          profile._json.email,
          profile._json.displayname,
          picturePath,
        );
      }
      return user;
    } catch (err) {
      return err;
    }
  }
}
