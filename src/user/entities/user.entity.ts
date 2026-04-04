import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    email: string;

    @Column('varchar', {
        unique: true
    })
    name: string;

    @Column('date')
    createdAt: Date;

    @Column('bool')
    isActive: boolean;
}