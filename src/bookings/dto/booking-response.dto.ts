import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../bookings.model';

export class BookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty()
  expiresAt?: Date;

  @ApiProperty({ type: [Object] })
  seats: { seatId: string; seatNumber: string }[];

  @ApiProperty()
  createdAt: Date;
}
