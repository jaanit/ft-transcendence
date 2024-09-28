import { IsString, IsInt } from 'class-validator';

export class memberDto
{
    @IsInt()
    group: number
    @IsString()
    userId: string
}