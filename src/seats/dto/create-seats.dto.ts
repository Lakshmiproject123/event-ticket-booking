import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({ example: ['A1', 'A2', 'A3'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  seatNumber: string[];  
}