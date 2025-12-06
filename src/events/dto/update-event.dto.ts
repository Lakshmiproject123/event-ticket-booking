// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

// export class UpdateEventDto {
//     @ApiProperty({ example: 'Music Concert',required: false })
//     title?: string;

//     @ApiProperty({ example: 'Concert by XYZ band', required: false  })
//     description?: string;

//     @ApiProperty({ example: '2025-12-25T19:00:00Z' ,required: false })
//     date?: string;

//     @ApiProperty({ example: 'Main Auditorium', required: false })
//     location?: string;

//     @ApiProperty({
//         type: 'string',
//         format: 'binary',
//         required: false,
//         description: 'Optional banner image',
//     })
//     banner?: any;
// }
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateEventDto {
    @ApiProperty({ example: 'Music Concert', required: false })
    @IsString({ message: 'Title must be a string' })
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Concert by XYZ band', required: false })
    @IsString({ message: 'Description must be a string' })
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '2025-12-25T19:00:00Z', required: false })
    @IsDateString({}, { message: 'Date must be a valid ISO 8601 string' })
    @IsOptional()
    date?: string;

    @ApiProperty({ example: 'Main Auditorium', required: false })
    @IsString({ message: 'Location must be a string' })
    @IsOptional()
    location?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Optional banner image',
    })
    @IsOptional()
    banner?: any;
}
