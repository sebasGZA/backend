import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { User } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";

@Module({
    imports: [TypeOrmModule.forFeature([User]),],
    controllers: [AuthController],
    providers: [AuthService, UserRepository],
    exports: [TypeOrmModule]
})
export class AuthModule { }