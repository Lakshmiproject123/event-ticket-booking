import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './bookings.model';
import { Seat } from '../seats/seats.model';
import { SeatsModule } from '../seats/seats.module';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking, Seat]),
    SeatsModule,
    ScheduleModule.forRoot(),
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule { }
