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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Booking } from './bookings.model';

@ApiTags('Bookings')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'))
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new booking for an event' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: Booking })
  @ApiResponse({ status: 400, description: 'Bad request or seats not available' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
    try {
      return await this.bookingsService.createBooking(req.user.id, dto.eventId, dto);
    } catch (err) {
      throw new HttpException(err.message || 'Failed to create booking', err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a pending booking' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully', type: Booking })
  @ApiResponse({ status: 400, description: 'Booking cannot be confirmed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async confirmBooking(@Req() req: any, @Param('id') bookingId: string) {
    try {
      return await this.bookingsService.confirmBooking(req.user.id, bookingId);
    } catch (err) {
      throw new HttpException(err.message || 'Failed to confirm booking', err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully', type: Booking })
  @ApiResponse({ status: 400, description: 'Booking cannot be cancelled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async cancelBooking(@Req() req: any, @Param('id') bookingId: string) {
    try {
      return await this.bookingsService.cancelBooking(req.user.id, bookingId);
    } catch (err) {
      throw new HttpException(err.message || 'Failed to cancel booking', err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all bookings of the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of bookings', type: [Booking] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyBookings(@Req() req: any) {
    try {
      return await this.bookingsService.getMyBookings(req.user.id);
    } catch (err) {
      throw new HttpException(err.message || 'Failed to fetch bookings', err.status || HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by its ID' })
  @ApiResponse({ status: 200, description: 'Booking details', type: Booking })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingById(@Req() req: any, @Param('id') bookingId: string) {
    try {
      const isAdmin = req.user.role === 'admin';
      return await this.bookingsService.getBookingById(req.user.id, bookingId, isAdmin);
    } catch (err) {
      throw new HttpException(err.message || 'Failed to fetch booking', err.status || HttpStatus.NOT_FOUND);
    }
  }
}
