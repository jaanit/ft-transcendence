import { IsInt, IsSemVer, IsString } from "class-validator";

export class messageDto{
    @IsInt()
    groupId:number
    @IsString()
    message:string

}