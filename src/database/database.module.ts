import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { dataSource } from "./datasource/datasource";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...dataSource.options
        })
    ]
})
export class DatabaseModule { }