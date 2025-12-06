// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsEnum, IsOptional } from 'class-validator';
// import { SeatStatus } from '../seats.model';

// export class UpdateSeatDto {
//   @ApiPropertyOptional({ enum: SeatStatus, description: 'Status of the seat' })
//   @IsEnum(SeatStatus)
//   @IsOptional()
//   status?: SeatStatus;

//   @ApiPropertyOptional({ description: 'Lock expiry date/time' })
//   @IsOptional()
//   lockExpiresAt?: Date;
// }
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { SeatStatus } from '../seats.model';

export class UpdateSeatDto {
  @ApiPropertyOptional({ enum: SeatStatus, description: 'Status of the seat' })
  @IsEnum(SeatStatus, { message: 'Status must be a valid SeatStatus' })
  @IsOptional()
  status?: SeatStatus;

  @ApiPropertyOptional({ description: 'Lock expiry date/time' })
  @IsDate({ message: 'lockExpiresAt must be a valid Date object' })
  @IsOptional()
  lockExpiresAt?: Date;
}

