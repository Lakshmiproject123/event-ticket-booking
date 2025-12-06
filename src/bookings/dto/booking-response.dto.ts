// import { ApiProperty } from '@nestjs/swagger';
// import { BookingStatus } from '../bookings.model';

// export class BookingResponseDto {
//   @ApiProperty()
//   id: string;

//   @ApiProperty({ enum: BookingStatus })
//   status: BookingStatus;

//   @ApiProperty()
//   expiresAt?: Date;

//   @ApiProperty({ type: [Object] })
//   seats: { seatId: string; seatNumber: string }[];

//   @ApiProperty()
//   createdAt: Date;
// }
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../bookings.model';

class BookingSeatDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab' })
  seatId: string;

  @ApiProperty({ example: 'A1' })
  seatNumber: string;
}

export class BookingResponseDto {
  @ApiProperty({ example: 'b1c2d3e4-f5g6-7890-hijk-1234567890lm' })
  id: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ type: Date, nullable: true, description: 'Expiry time for pending booking' })
  expiresAt?: Date | null;

  @ApiProperty({ type: [BookingSeatDto] })
  seats: BookingSeatDto[];

  @ApiProperty({ type: Date })
  createdAt: Date;
}
