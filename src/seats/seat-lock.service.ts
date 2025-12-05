import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SeatsService } from './seats.service';

@Injectable()
export class SeatLockService {
  constructor(private seatsService: SeatsService) {}

  @Cron('*/30 * * * * *') 
  handleCron() {
    this.seatsService.unlockExpiredSeats();
  }
}

