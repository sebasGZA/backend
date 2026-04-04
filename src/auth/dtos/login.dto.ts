import { ApiProperty } from "@nestjs/swagger";
import { UserEnum } from "../enums/user.enum";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: UserEnum.EMAIL,
    })
    email: string;


    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: UserEnum.PASSWORD,
    })
    password: string;
}