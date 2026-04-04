import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";

import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";

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
            })
            await this.save(user);
            return {
                id: user.id, email, name
            }
        } catch (err) {
            this.handleErrors(err);
        }
    }

    private handleErrors(error: any) {
        if (error.code === '23505') throw new BadRequestException(error.detail);
        throw new InternalServerErrorException(error?.message);
    }
}