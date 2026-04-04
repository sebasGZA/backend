import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/login.dto";
import { CreateUserDto } from "../dtos/create-user.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.getUserLogin(loginDto)
    }

    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.registerUser(createUserDto);
    }
}