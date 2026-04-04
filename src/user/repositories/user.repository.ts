import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";

import { User } from "../entities/user.entity";
import { CreateUserDto } from "../../auth/dtos/create-user.dto";
import { PaginationDto } from "src/shared/dtos/pagination.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(dataSource: DataSource) {
        super(User, dataSource.createEntityManager())
    }

    findByEmail(email: string) {
        return this.findOne({
            where: {
                email
            },
            select: {
                id: true,
                email: true,
                password: true,
                isActive: true,
            }
        })
    }

    async createUser({ email, name, password }: CreateUserDto) {
        try {
            const user = this.create({
                email,
                name,
                password,
                isActive: true,
                createdAt: new Date(),
            })
            await this.save(user);
            return {
                id: user.id, email, name
            }
        } catch (err) {
            this.handleErrors(err);
        }
    }

    getUsers({ limit, offset }: PaginationDto) {
        return this.find({
            take: limit,
            skip: offset,
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
            },
        });
    }

    getUserById(id: number) {
        return this.findOne({ where: { id }, select: { id: true, name: true, isActive: true, email: true } })
    }

    private handleErrors(error: any) {
        if (error.code === '23505') throw new BadRequestException(error.detail);
        throw new InternalServerErrorException(error?.message);
    }
}