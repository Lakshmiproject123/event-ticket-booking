import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Event } from '../events/events.model';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}
@Table({ tableName: 'Bookings' })
export class Booking extends Model {
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @ForeignKey(() => Event)
  @Column({ type: DataType.UUID, allowNull: false })
  declare eventId: string;

  @Column({ type: DataType.ENUM('pending','confirmed','cancelled','expired'), defaultValue: BookingStatus.PENDING })
  declare status: BookingStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  declare expiresAt: Date | null;

  @Column({ type: DataType.JSONB, allowNull: false })
  declare seats: { seatId: string; seatNumber: string }[];
}

