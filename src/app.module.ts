import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    AuthModule,
    UsersModule,
    EventsModule,
    
    
    
  ],
})
export class AppModule {}
