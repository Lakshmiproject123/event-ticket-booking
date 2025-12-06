import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { S3Service } from '../aws/s3/s3.service';
import { Event } from './events.model';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(private readonly s3Service: S3Service) { }

    async create(dto: CreateEventDto, bannerFile: Express.Multer.File) {
        try {
            let bannerUrl: string | undefined = undefined;

            if (bannerFile) {
                bannerUrl = await this.s3Service.uploadBanner(bannerFile);
            }

            const event = await Event.create({
                title: dto.title,
                description: dto.description,
                date: dto.date,
                location: dto.location,
                bannerUrl,
            });

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Event created successfully',
                data: event,
            };

        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new HttpException(
                    'An event with the same title, date, and location already exists',
                    HttpStatus.CONFLICT,
                );
            }

            throw new HttpException(error.message || 'Failed to create event', HttpStatus.BAD_REQUEST);
        }
    }


    async findAll() {
        const events = await Event.findAll();

        return {
            statusCode: HttpStatus.OK,
            message: 'Events fetched successfully',
            data: events,
        };
    }

    async findOne(id: string) {
        const event = await Event.findByPk(id);
        if (!event) throw new NotFoundException('Event not found');

        return {
            statusCode: HttpStatus.OK,
            message: 'Event fetched successfully',
            data: event,
        };
    }

    async update(id: string, dto: UpdateEventDto, bannerFile?: Express.Multer.File) {
        const event = await Event.findByPk(id);
        if (!event) throw new NotFoundException('Event not found');

        let bannerUrl = event.bannerUrl;

        if (bannerFile) {
            bannerUrl = await this.s3Service.uploadBanner(bannerFile);
        }

        await event.update({
            ...dto,
            bannerUrl,
        });

        return {
            statusCode: HttpStatus.OK,
            message: 'Event updated successfully',
            data: event,
        };
    }
}
