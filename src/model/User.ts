import { Exclude } from "class-transformer";
import { Field, ID, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthToken } from "./AuthToken";

@Entity({ name: "users" })
@ObjectType()
export class User {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    firstName: string;

    @Column()
    @Field()
    lastName: string;

    @Column()
    @Field()
    email: string;

    @Exclude()
    @Column({ select: false })
    password: string;

    @OneToOne(() => AuthToken, authToken => authToken.user)
    @JoinColumn()
    @Field()
    authToken: AuthToken;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    @Field(() => Date)
    createdAt: Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    @Field(() => Date)
    updatedAt: Date;
}