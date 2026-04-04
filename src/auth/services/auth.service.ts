import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "src/user/repositories/user.repository";
import { LoginDto } from "../dtos/login.dto";

@Injectable()
export class AuthService {

    constructor(private readonly userRepository: UserRepository) { }

    async getUserLogin({ email, password }: LoginDto) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundException('The credentials are incorrect');

        if (password !== user.password) throw new BadRequestException('The credentials are incorrect');

        return {
            id: user.id,
            email: user.email,
        }
    }
}