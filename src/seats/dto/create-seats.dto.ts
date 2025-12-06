// import { ApiProperty } from '@nestjs/swagger';
// import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

// export class CreateSeatDto {
//   @ApiProperty({ example: ['A1', 'A2', 'A3'] })
//   @IsArray()
//   @ArrayNotEmpty()
//   @IsString({ each: true })
//   seatNumber: string[];  
// }
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString, IsNotEmpty } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({ example: ['A1', 'A2', 'A3'] })
  @IsArray({ message: 'seatNumber must be an array' })
  @ArrayNotEmpty({ message: 'seatNumber array cannot be empty' })
  @IsString({ each: true, message: 'Each seatNumber must be a string' })
  @IsNotEmpty({ each: true, message: 'Seat numbers cannot be empty strings' })
  seatNumber: string[];
}
