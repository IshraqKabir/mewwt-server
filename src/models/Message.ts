import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;
}