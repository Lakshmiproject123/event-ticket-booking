
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Seat } from './seats.model';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { SeatLockService } from './seat-lock.service';
import { Event } from '../events/events.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Seat, Event]), 
  ],
  controllers: [SeatsController],
  providers: [SeatsService, SeatLockService], 
  exports: [SeatsService],
})
export class SeatsModule {}

