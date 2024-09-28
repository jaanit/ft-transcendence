import { IsNumber, IsString } from 'class-validator';

export class changePrivacyDto {
  @IsNumber()
  group_id: number;
  @IsString()
  name: string;
  @IsString()
  password: string;
  @IsString()
  privacy: string;
  @IsString()
  picture: string;
}
