import { HttpException, HttpStatus, Injectable,UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Request } from 'express';


const extractCookie = (req: Request): string | null => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: AuthService,private readonly configService: ConfigService) {
      
      super({
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: configService.get('JWT_SECRET_KEY')
      });
    }
  
    async validate(payload: any) {
      const user = await this.authService.findUserById(payload.userId);
      if (!user) {
        throw new UnauthorizedException()
      }
      return  user;
    }
  }