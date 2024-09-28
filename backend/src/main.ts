import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 600000,
      },
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  const corsOptions = {
    origin: process.env.NEXT_PUBLIC_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.use('/upload', express.static(path.join(__dirname, '../upload')));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(8000);
}
bootstrap();
