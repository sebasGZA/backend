import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { UserRepository } from "../repositories/user.repository";
import { LoginDto } from "../dtos/login.dto";
import { CreateUserDto } from "../dtos/create-user.dto";

@Injectable()
export class AuthService {

    constructor(private readonly userRepository: UserRepository) { }

    async getUserLogin({ email, password }: LoginDto) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.isActive || !bcrypt.compareSync(password, user.password)) 
            throw new BadRequestException('The credentials are incorrect');

        return {
            id: user.id,
            email: user.email,
        }
    }

    async registerUser({ email, name, password }: CreateUserDto) {
        const userDb = await this.userRepository.findByEmail(email);
        if (userDb) throw new BadRequestException('User already exists');

        const newPassword = bcrypt.hashSync(password, 10);
        const newUser = await this.userRepository.createUser({ email, name, password: newPassword })
        return newUser;
    }
}