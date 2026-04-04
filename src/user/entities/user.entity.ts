import { Post } from "../../post/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @Column('varchar', {
        unique: true
    })
    name: string;

    @Column('date')
    createdAt: Date;

    @Column('bool')
    isActive: boolean;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]
}