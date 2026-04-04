import 'dotenv/config';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../auth/entities/user.entity';

import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    entities: [User, Post],
    migrations: ['src/migrations/*{.ts,.js}'],
    synchronize: false,
})