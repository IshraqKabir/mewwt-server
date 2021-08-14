import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./Message";
import { RoomUser } from "./RoomUser";
import { User } from "./User";

@Entity({ name: "rooms" })
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name?: string;

    @ManyToMany(() => User, user => user.rooms)
    @JoinTable({
        name: "rooms_users",
        joinColumn: {
            name: "room_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
    })
    users: User[];

    @OneToMany(() => RoomUser, roomsUsers => roomsUsers.room)
    roomsUsers: RoomUser[];

    @OneToMany(() => Message, message => message.room)
    messages: Message[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;
}