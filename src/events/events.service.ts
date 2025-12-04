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

            return event;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    async findAll() {
        return Event.findAll();
    }

    async findOne(id: string) {
        const event = await Event.findByPk(id);
        if (!event) throw new NotFoundException('Event not found');
        return event;
    }

   async update(id: string, dto: UpdateEventDto, bannerFile?: Express.Multer.File) {
    const event = await this.findOne(id);

    let bannerUrl = event.bannerUrl;

    if (bannerFile) {
        bannerUrl = await this.s3Service.uploadBanner(bannerFile);
    }

    return await event.update({
        ...dto,
        bannerUrl, 
    });
}

}
