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
  ForbiddenException
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
  @ApiOperation({ summary: 'Create a new booking for an event(customer only)' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or seats not available' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden for admin' })
  async createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
    try {
      return await this.bookingsService.createBooking(req.user.id, dto.eventId, dto, req.user.role);
    } catch (err) {
      throw new HttpException({
        statusCode: err.status || HttpStatus.BAD_REQUEST,
        message: err.message || 'Failed to create booking',
        data: null,
      }, err.status || HttpStatus.BAD_REQUEST);
    }
  }


  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a pending booking' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
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
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
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
  @ApiResponse({ status: 200, description: 'List of bookings' })
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
  @ApiResponse({ status: 200, description: 'Booking details' })
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

  @Get('admin/all')
  @ApiOperation({ summary: 'Admin – Get all bookings' })
  @ApiResponse({ status: 200, description: 'All bookings fetched successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllBookings(@Req() req: any) {
    try {
      if (req.user.role !== 'admin') {
        throw new ForbiddenException('Only admin can access this');
      }

      const bookings = await this.bookingsService.getAllBookings();
      return bookings;

    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Failed to fetch all bookings: ${error.message}`,
        500
      );
    }
  }

  @Get('admin/event/:eventId')
  @ApiOperation({ summary: 'Admin – Get bookings for a specific event' })
  async getBookingsByEvent(
    @Req() req: any,
    @Param('eventId') eventId: string
  ) {
    try {
      if (req.user.role !== 'admin') {
        throw new ForbiddenException('Only admin can access this');
      }

      const bookings = await this.bookingsService.getBookingsByEvent(eventId);

      if (!bookings.data || bookings.data.length === 0) {
        throw new HttpException('No bookings found for this event', 404);
      }

      return bookings; 

    } catch (error: any) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        `Failed to fetch bookings for event ${eventId}: ${error.message}`,
        500
      );
    }
  }
}