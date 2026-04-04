import { User } from "../../auth/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    title: string;

    @Column('varchar')
    content: string;

    @Column('date')
    createdAt: Date

    @ManyToOne(() => User, (user) => user.posts)
    user: User;
}