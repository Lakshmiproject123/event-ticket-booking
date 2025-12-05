import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SeatsModule } from './seats/seats.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),

    ScheduleModule.forRoot(),

    AuthModule,
    UsersModule,
    EventsModule,
    SeatsModule,
    BookingsModule,
  ],
})
export class AppModule { }
