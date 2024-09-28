import {IsEmail,IsNotEmpty,IsNumber} from 'class-validator'


export class updatedUser {
    @IsNotEmpty()
    nickname :string;

    @IsNotEmpty()
    displayname :string;

    @IsNotEmpty()
    picture :string;

 
 
}