import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';

dotenv.config();

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, JwtStrategy],  
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
