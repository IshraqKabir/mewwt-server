import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('rooms_users')
export class RoomsUsers {
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    updatedAt: Date;

    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    userId: number;

    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    roomId: number;
}