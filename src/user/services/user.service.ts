import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { PaginationDto } from "../../shared/dtos/pagination.dto";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    findUsers(paginationDto: PaginationDto) {
        return this.userRepository.getUsers(paginationDto);
    }

    async findById(id: number) {
        const user = await this.userRepository.getUserById(id);
        if (!user) throw new NotFoundException('User not found')
        return user;
    }
}