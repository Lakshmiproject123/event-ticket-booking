// import { ApiProperty } from '@nestjs/swagger';
// import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

// export class CreateBookingDto {
//   @ApiProperty({ description: 'Event ID to book' })
//   @IsUUID()
//   eventId: string;

//   @ApiProperty({ description: 'Array of seat IDs to book' })
//   @IsArray()
//   @ArrayNotEmpty()
//   @IsUUID('all', { each: true })
//   seatIds: string[];
// }
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Event ID to book', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'Array of seat IDs to book', example: ['a1b2c3d4-e5f6-7890-abcd-1234567890ab'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  seatIds: string[];
}
