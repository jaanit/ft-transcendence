import { IsString, IsInt, IsDate } from 'class-validator';

export class muteDto
{
    @IsInt()
    group: number
    @IsString()
    userId: string
    // @IsDate()
    date: Date
}