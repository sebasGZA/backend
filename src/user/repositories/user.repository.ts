import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { DataSource } from "typeorm/browser";

import { User } from "../entities/user.entity";

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
}