import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@Entity('rooms_users')
export class RoomUser {
    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    user_id: number;

    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    room_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Room)
    @JoinColumn({ name: "room_id" })
    room: Room;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;
}