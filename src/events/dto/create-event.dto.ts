import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateEventDto {

  @ApiProperty({ example: 'Music Concert' })
  @IsString()
  @IsNotEmpty()
  title: string;  

  @ApiProperty({ example: 'Concert by XYZ band', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-12-25T19:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Main Auditorium' })
  @IsString()
  @IsNotEmpty()
  location: string;  

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Event banner image file (jpeg/png)',
    required: false,
  })
  banner?: any;  
}
