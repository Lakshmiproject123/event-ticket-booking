import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking, BookingStatus } from './bookings.model';
import { Seat, SeatStatus } from '../seats/seats.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Op } from 'sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Booking) private bookingModel: typeof Booking,
    @InjectModel(Seat) private seatModel: typeof Seat,
  ) { }

  async createBooking(userId: string, eventId: string, dto: CreateBookingDto, userRole: string) {
    if (userRole === 'admin') {
      throw new ForbiddenException('Admin cannot create bookings');
    }

    const now = new Date();

    const seats = await this.seatModel.findAll({
      where: {
        id: dto.seatIds,
        [Op.or]: [
          { status: SeatStatus.AVAILABLE },
          { status: SeatStatus.LOCKED, lockExpiresAt: { [Op.lt]: now } },
        ],
      },
    });

    if (seats.length !== dto.seatIds.length) {
      throw new BadRequestException('One or more seats are not available or already booked');
    }

    const lockExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this.seatModel.update(
      { status: SeatStatus.LOCKED, lockExpiresAt },
      {
        where: { id: dto.seatIds, status: SeatStatus.AVAILABLE },
      },
    );

    const booking = await this.bookingModel.create({
      userId,
      eventId,
      status: BookingStatus.PENDING,
      expiresAt: lockExpiresAt,
      seats: seats.map(s => ({ seatId: s.id, seatNumber: s.seatNumber })),
    });

    return {
      statusCode: 201,
      message: 'Booking created successfully',
      data: booking,
    };
  }

  async confirmBooking(userId: string, bookingId: string) {
    const booking = await this.bookingModel.findByPk(bookingId);

    if (!booking) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Booking not found',
      });
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Not your booking',
      });
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Booking cannot be confirmed',
      });
    }

    const seatIds = booking.seats.map(s => s.seatId);

    await this.seatModel.update(
      { status: SeatStatus.BOOKED, lockExpiresAt: null },
      { where: { id: seatIds } },
    );

    booking.status = BookingStatus.CONFIRMED;
    booking.expiresAt = null;
    await booking.save();

    return {
      statusCode: 200,
      message: 'Booking confirmed successfully',
      data: booking,
    };
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.bookingModel.findByPk(bookingId);

    if (!booking) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Booking not found',
      });
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Not your booking',
      });
    }

    const seatIds = booking.seats.map(s => s.seatId);

    await this.seatModel.update(
      { status: SeatStatus.AVAILABLE, lockExpiresAt: null },
      { where: { id: seatIds } },
    );

    booking.status = BookingStatus.CANCELLED;
    await booking.save();

    return {
      statusCode: 200,
      message: 'Booking cancelled successfully',
      data: booking,
    };
  }

  async getMyBookings(userId: string) {
    const bookings = await this.bookingModel.findAll({ where: { userId } });

    return {
      statusCode: 200,
      message: 'User bookings fetched successfully',
      data: bookings,
    };
  }

  async getBookingById(userId: string, bookingId: string, isAdmin = false) {
    const booking = await this.bookingModel.findByPk(bookingId);

    if (!booking) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Booking not found',
      });
    }

    if (!isAdmin && booking.userId !== userId) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Not authorized',
      });
    }

    return {
      statusCode: 200,
      message: 'Booking details fetched successfully',
      data: booking,
    };
  }

  async unlockExpiredBookings() {
    const now = new Date();

    const expiredBookings = await this.bookingModel.findAll({
      where: {
        status: BookingStatus.PENDING,
        expiresAt: { [Op.lt]: now },
      },
    });

    if (!expiredBookings.length) {
      return {
        statusCode: 200,
        message: 'No expired bookings found',
        data: [],
      };
    }

    const allSeatIds = expiredBookings.flatMap(b =>
      (b.seats || []).map((s: any) => s.seatId),
    );

    if (allSeatIds.length) {
      await this.seatModel.update(
        { status: SeatStatus.AVAILABLE, lockExpiresAt: null },
        { where: { id: allSeatIds } },
      );
    }

    const bookingIds = expiredBookings.map(b => b.id);
    await this.bookingModel.update(
      { status: BookingStatus.EXPIRED },
      { where: { id: bookingIds } },
    );

    expiredBookings.forEach(b =>
      this.logger.log(`Booking ${b.id} expired and seats released`),
    );

    return {
      statusCode: 200,
      message: 'Expired bookings unlocked and updated',
      data: expiredBookings,
    };
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleExpiredBookings() {
    this.logger.log('Running cron: check expired bookings...');
    await this.unlockExpiredBookings();
  }

  async getAllBookings() {
  const bookings = await this.bookingModel.findAll();

  return {
    statusCode: 200,
    message: 'All bookings fetched successfully',
    data: bookings,
  };
}

async getBookingsByEvent(eventId: string) {
  const bookings = await this.bookingModel.findAll({
    where: { eventId },
  });

  return {
    statusCode: 200,
    message: 'Bookings for event fetched successfully',
    data: bookings,
  };
}
}


