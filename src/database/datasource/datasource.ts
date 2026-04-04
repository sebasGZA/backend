import 'dotenv/config';

import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*.js'],
    synchronize: false,
})