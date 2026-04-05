import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'This is a title'
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'This is a content'
    })
    content: string;
}