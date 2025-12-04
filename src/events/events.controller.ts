import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('events')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @Roles('admin')
    @UseInterceptors(
        FileInterceptor('banner', {
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return callback(
                        new HttpException('Only JPG, JPEG, PNG files are allowed', HttpStatus.BAD_REQUEST),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Event data with banner image',
        type: CreateEventDto,
        required: true,
    })
    @ApiResponse({ status: 201, description: 'Event created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden. Only admin can create events' })
    async create(
        @UploadedFile() banner: Express.Multer.File,
        @Body() dto: CreateEventDto,
        @Req() req: any,
    ) {
        const role = req.user.role;
        if (role !== 'admin') {
            throw new HttpException(
                'Access denied. Only Admin can create events',
                HttpStatus.FORBIDDEN,
            );
        }
        return await this.eventsService.create(dto, banner);
    }


    @Get()
    async findAll() {
        return this.eventsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Patch(':id')
    @Roles('admin')
    @UseInterceptors(FileInterceptor('banner'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Update event fields, including optional banner image',
        type: UpdateEventDto,
    })
    async update(
        @Param('id') id: string,
        @UploadedFile() banner: Express.Multer.File,
        @Body() dto: UpdateEventDto,
        @Req() req: any,
    ) {
        return this.eventsService.update(id, dto, banner);
    }

}
