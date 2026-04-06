import 'dotenv/config';
import { DataSource } from "typeorm";

import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

export const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    entities: [User, Post],
    migrations: ['src/migrations/*{.ts,.js}'],
    synchronize: false,
})