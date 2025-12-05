import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Event ID to book' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'Array of seat IDs to book' })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  seatIds: string[];
}
