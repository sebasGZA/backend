import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";

import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/login.dto";
import { CreateUserDto } from "../dtos/create-user.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
        return this.authService.getUserLogin(res, loginDto)
    }

    @Post('register')
    register(@Res({ passthrough: true }) res: Response, @Body() createUserDto: CreateUserDto) {
        return this.authService.registerUser(res, createUserDto);
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token');
        return { success: true };
    }
}