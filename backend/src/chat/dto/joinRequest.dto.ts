import { IsString, IsInt } from 'class-validator';

export class joinRequest
{
    @IsInt()
    group: number

    password?: string
}