import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./entities/user.entity";
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [TypeOrmModule],
})
export class UserModule { }