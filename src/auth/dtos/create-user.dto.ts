import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UserEnum } from "../enums/user.enum";

export class CreateUserDto {

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

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: UserEnum.NAME,
    })
    name: string;
}