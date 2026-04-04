import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'test',
    username: 'admin',
    password: 'admin',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
})