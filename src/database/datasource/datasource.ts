import 'dotenv/config';
import { User } from '../../user/entities/user.entity';

import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    entities: [User],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
})