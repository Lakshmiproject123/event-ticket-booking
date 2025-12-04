import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './events.model';
import { AuthModule } from '../auth/auth.module'; 
import { S3Service } from '../aws/s3/s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([Event]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, S3Service],
})
export class EventsModule {}
