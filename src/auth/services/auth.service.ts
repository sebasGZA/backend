import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { UserRepository } from "../../user/repositories/user.repository";
import { LoginDto } from "../dtos/login.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { JwtPayload } from "../interfaces/jwt.interface";
import { User } from "../../user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService,) { }

    async getUserLogin({ email, password }: LoginDto) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.isActive || !bcrypt.compareSync(password, user.password))
            throw new BadRequestException('The credentials are incorrect');

        return {
            id: user.id,
            email: user.email,
            token: this.getJwtToken({ id: user.id })
        }
    }

    async registerUser({ email, name, password }: CreateUserDto) {
        const userDb = await this.userRepository.findByEmail(email);
        if (userDb) throw new BadRequestException('User already exists');

        const newPassword = bcrypt.hashSync(password, 10);
        const newUser = await this.userRepository.createUser({ email, name, password: newPassword })
        const userId = newUser?.id
        return { ...newUser, token: this.getJwtToken({ id: userId! }) };
    }

    async checAuthStatus(user: User) {
        return {
            ...user,
            token: this.getJwtToken({ id: user.id }),
        };
    }

    private getJwtToken(payload: JwtPayload) {
        return this.jwtService.sign(payload);
    }
}