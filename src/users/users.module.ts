import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { UsersSeeder } from './users.seeder';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService, UsersSeeder],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
