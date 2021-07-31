import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./Message";
import { Room } from "./Room";
import { RoomsUsers } from "./RoomsUsers";

@Entity({ name: "users" })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ type: "text", nullable: true, select: false })
    authToken: string;

    @ManyToMany(() => Room, room => room.users)
    rooms: Room[];

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    @OneToMany(() => RoomsUsers, roomsUsers => roomsUsers.user)
    roomsUsers: RoomsUsers[];

    @Column({ select: false })
    password: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;
}
