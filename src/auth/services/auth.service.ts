import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";

import { UserRepository } from "../../user/repositories/user.repository";
import { LoginDto } from "../dtos/login.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { JwtPayload } from "../interfaces/jwt.interface";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async getUserLogin(res: Response, { email, password }: LoginDto) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.isActive || !bcrypt.compareSync(password, user.password))
            throw new BadRequestException('The credentials are incorrect');

        const token = this.generateCookie(res, user.id);
        return {
            id: user.id,
            email: user.email,
            token,
        }
    }

    async registerUser(res: Response, { email, name, password }: CreateUserDto) {
        const userDb = await this.userRepository.findByEmail(email);
        if (userDb) throw new BadRequestException('User already exists');

        const newPassword = bcrypt.hashSync(password, 10);
        const newUser = await this.userRepository.createUser({ email, name, password: newPassword })
        const userId = newUser?.id
        const token = this.generateCookie(res, userId!);
        return { ...newUser, token };
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

    private generateCookie(res: Response, id: number) {
        const token = this.getJwtToken({ id });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
        return token;
    }
}