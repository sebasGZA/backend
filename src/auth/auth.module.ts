import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { User } from "../user/entities/user.entity";
import { UserRepository } from "../user/repositories/user.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: '2h',
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository],
    exports: [TypeOrmModule]
})
export class AuthModule { }