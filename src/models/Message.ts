import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MessageRead } from "./MessageRead";
import { Room } from "./Room";
import { User } from "./User";

@Entity({ name: "messages" })
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    text: string;

    @Column()
    sender_id: number;
    @ManyToOne(() => User, user => user.messages, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "sender_id" })
    sender: User;

    @Column()
    room_id: number;
    @ManyToOne(() => Room, room => room.messages, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "room_id" })
    room: Room;

    @OneToMany(() => MessageRead, messageRead => messageRead.reader)
    reads: MessageRead[];

    @Column({ nullable: true })
    reply_to_message_id: number;
    @ManyToOne(() => Message, message => message.reply_to_message, { nullable: true, onDelete: "NO ACTION", })
    @JoinColumn({ name: "reply_to_message_id" })
    reply_to_message: Message;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;
}