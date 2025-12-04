import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class UpdateEventDto {
    @ApiProperty({ example: 'Music Concert',required: false })
    title?: string;

    @ApiProperty({ example: 'Concert by XYZ band', required: false  })
    description?: string;

    @ApiProperty({ example: '2025-12-25T19:00:00Z' ,required: false })
    date?: string;

    @ApiProperty({ example: 'Main Auditorium', required: false })
    location?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Optional banner image',
    })
    banner?: any;
}
