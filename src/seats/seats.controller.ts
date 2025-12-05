// import {
//     Controller,
//     Post,
//     Get,
//     Patch,
//     Param,
//     Body,
//     Req,
//     HttpException,
//     HttpStatus,
//     UseGuards,
// } from '@nestjs/common';
// import { SeatsService } from './seats.service';
// import { CreateSeatDto } from './dto/create-seats.dto';
// import { UpdateSeatDto } from './dto/update-seats.dto';
// import { Roles } from '../roles/roles.decorator';
// import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
// import { UserRole } from '../users/users.model';
// import { AuthGuard } from '@nestjs/passport';

// @ApiTags('Seats')
// @ApiBearerAuth('JWT')
// @UseGuards(AuthGuard('jwt'))
// @Controller('events')
// export class SeatsController {
//     constructor(private readonly seatsService: SeatsService) { }

//     @Post(':id/seats')
//     @Roles(UserRole.ADMIN)
//     @ApiOperation({ summary: 'Admin-only: Create seats for an event' })
//     async createSeats(@Param('id') eventId: string, @Body() dto: CreateSeatDto) {
//         try {
//             return await this.seatsService.createSeats(eventId, dto);
//         } catch (err) {
//             throw new HttpException(
//                 { message: err.message || 'Failed to create seats' },
//                 HttpStatus.BAD_REQUEST,
//             );
//         }
//     }

//     @Get(':id/seats')
//     @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
//     @ApiOperation({ summary: 'Admin or Customer: Get all seats for an event' })
//     async getSeats(@Param('id') eventId: string) {
//         try {
//             return await this.seatsService.getSeats(eventId);
//         } catch (err) {
//             throw new HttpException(
//                 { message: err.message || 'No seats found for this event' },
//                 HttpStatus.NOT_FOUND,
//             );
//         }
//     }

//     @Get(':id/seats/available')
//     @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
//     @ApiOperation({ summary: 'Admin or Customer: Get only available seats for an event' })
//     async getAvailableSeats(@Param('id') eventId: string) {
//         try {
//             return await this.seatsService.getAvailableSeats(eventId);
//         } catch (err) {
//             throw new HttpException(
//                 { message: err.message || 'Failed to fetch available seats' },
//                 HttpStatus.NOT_FOUND,
//             );
//         }
//     }

//     @Patch('seats/:id')
//     @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
//     async updateSeat(@Param('id') seatId: string, @Body() dto: UpdateSeatDto, @Req() req: any) {
//         const userId = req.user.id;
//         const userRole = req.user.role; // Add this
//         return await this.seatsService.updateSeat(seatId, dto, userId, userRole);
//     }


// }
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seats.dto';
import { UpdateSeatDto } from './dto/update-seats.dto';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from '../users/users.model';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Seats')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('events')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post(':id/seats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin-only: Create seats for an event' })
  async createSeats(@Param('id') eventId: string, @Body() dto: CreateSeatDto) {
    try {
      return await this.seatsService.createSeats(eventId, dto);
    } catch (err) {
      throw new HttpException(
        { message: err.message || 'Failed to create seats' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id/seats')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Admin or Customer: Get all seats for an event' })
  async getSeats(@Param('id') eventId: string) {
    try {
      return await this.seatsService.getSeats(eventId);
    } catch (err) {
      throw new HttpException(
        { message: err.message || 'No seats found for this event' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':id/seats/available')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Admin or Customer: Get only available seats for an event' })
  async getAvailableSeats(@Param('id') eventId: string) {
    try {
      return await this.seatsService.getAvailableSeats(eventId);
    } catch (err) {
      throw new HttpException(
        { message: err.message || 'Failed to fetch available seats' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

}
