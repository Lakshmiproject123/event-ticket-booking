// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

// export class CreateEventDto {

//   @ApiProperty({ example: 'Music Concert' })
//   @IsString()
//   @IsNotEmpty()
//   title: string;  

//   @ApiProperty({ example: 'Concert by XYZ band', required: false })
//   @IsString()
//   @IsOptional()
//   description?: string;

//   @ApiProperty({ example: '2025-12-25T19:00:00Z' })
//   @IsDateString()
//   @IsNotEmpty()
//   date: string;

//   @ApiProperty({ example: 'Main Auditorium' })
//   @IsString()
//   @IsNotEmpty()
//   location: string;  

//   @ApiProperty({
//     type: 'string',
//     format: 'binary',
//     description: 'Event banner image file (jpeg/png)',
//     required: false,
//   })
//   banner?: any;  
// }
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateEventDto {

  @ApiProperty({ example: 'Music Concert' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;  

  @ApiProperty({ example: 'Concert by XYZ band', required: false })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-12-25T19:00:00Z' })
  @IsDateString({}, { message: 'Date must be a valid ISO 8601 string' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @ApiProperty({ example: 'Main Auditorium' })
  @IsString({ message: 'Location must be a string' })
  @IsNotEmpty({ message: 'Location is required' })
  location: string;  

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Event banner image file (jpeg/png)',
    required: false,
  })
  @IsOptional()
  banner?: any;  
}
