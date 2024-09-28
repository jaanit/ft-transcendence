import * as jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { authenticator, totp } from 'otplib';
import axios from 'axios';
import * as fs from 'fs';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private image: ImageService,
  ) {}

  private get secretKey(): string {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return null;
    }
  }

  async isNicknameUnique(nickname: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        nickname,
      },
    });
    return user;
  }

  async createRandomName() {
    const name = (Math.random() + 1).toString(36).substring(7);
    if (await this.isNicknameUnique(name)) return await this.createRandomName();
    return name;
  }

  getFormattedCurrentDate(): string {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}${currentDate
      .getDate()
      .toString()
      .padStart(2, '0')}_${currentDate
      .getHours()
      .toString()
      .padStart(2, '0')}${currentDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}${currentDate
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
    return formattedDate;
  }

  async saveImage(username: string, imageUrl: string): Promise<string> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      return this.image.uploadFromAuth(response.data);
    } catch (error) {
      return imageUrl;
    }
  }

  async createUser(
    auth_id: string,
    email: string,
    displayname: string,
    picture: string,
  ) {
    const nickname = await this.createRandomName();

    return this.prisma.users.create({
      data: {
        auth_id,
        email,
        nickname,
        displayname,
        picture,
        stats: {
          create: {
            wins: 0,
            losses: 0,
            goal_conceded: 0,
            goal_scoared: 0,
            clean_sheets: 0,
          },
        },
      },
    });
  }

  async findUserById(auth_id: string) {
    const user = await this.prisma.users.findUnique({ where: { auth_id } });
    return user;
  }

  async updateUser(
    auth_id: string,
    nickname: string,
    displayname: string,
    picture: string,
    firstSignIn: boolean,
  ) {
    const updatedUser = await this.prisma.users.update({
      where: { auth_id },
      data: { nickname, displayname, picture, firstSignIn },
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${auth_id} not found`);
    }
    return updatedUser;
  }

  generateSecret(): string {
    return authenticator.generateSecret();
  }

  generateTotpCode(secret: string): string {
    totp.options = { step: 120 };
    return totp.generate(secret);
  }

  verifyTFA(secret: string, code: string): boolean {
    return totp.verify({ secret, token: code });
  }

  async sendEmail(email: string, code: string) {
    try {
      const transporter = createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASS'),
        },
      });
      const mailOptions = {
        from: 'ft_transcendence <ft.transcendence1337@gmail.com>',
        to: email,
        subject: '2FA of ft_transcendence.',
        text: `Here is your 6-digit code: ${code}
          It expires in 2 minutes, Hurry up!`,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
    }
  }

  async logout(auth_id: string) {
    
    await this.prisma.users.updateMany({
      where: {
        auth_id: auth_id,
      },
      data: {
        status: 'offline',
      },
    });
  }
}
