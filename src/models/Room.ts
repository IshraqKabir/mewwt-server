import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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
            name: "roomId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "userId",
            referencedColumnName: "id",
        },
    })
    users: User[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    createdAt: Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    updatedAt: Date;
}