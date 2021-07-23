import { Field, ID, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "auth_tokens" })
@ObjectType()
export class AuthToken {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column("text")
    @Field()
    token: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Field(() => Date)
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @Field(() => Date)
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}