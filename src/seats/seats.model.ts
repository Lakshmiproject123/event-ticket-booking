import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Event } from '../events/events.model';

export enum SeatStatus {
    AVAILABLE = 'available',
    LOCKED = 'locked',
    BOOKED = 'booked',
}

@Table({
    indexes: [
        {
            unique: true,
            fields: ['eventId', 'seatNumber'], 
        },
    ],
})
export class Seat extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare readonly id: string;

    @ForeignKey(() => Event)
    @Column({ type: DataType.UUID, allowNull: false })
    eventId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    seatNumber: string;

    @Column({ type: DataType.ENUM(...Object.values(SeatStatus)), defaultValue: SeatStatus.AVAILABLE })
    status: SeatStatus;

    @Column({ type: DataType.DATE, allowNull: true })
    lockExpiresAt: Date | null;
}

