import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./Message";
import { User } from "./User";

@Entity({ name: "message_reads" })
export class MessageRead extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    reader_id: number;
    @ManyToOne(() => User, user => user.messageReads, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "reader_id" })
    reader: User;

    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    message_id: number;
    @ManyToOne(() => Message, messsage => messsage.reads, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "message_id" })
    message: Message;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;
}