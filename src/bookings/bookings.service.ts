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
import { SeatsService } from '../seats/seats.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Booking) private bookingModel: typeof Booking,
    private seatsService: SeatsService,
    @InjectModel(Seat) private seatModel: typeof Seat,
  ) { }

  async createBooking(userId: string, eventId: string, dto: CreateBookingDto) {

    const now = new Date();

    const seats = await this.seatModel.findAll({
      where: {
        id: dto.seatIds,
        [Op.or]: [
          { status: SeatStatus.AVAILABLE },
          {
            [Op.and]: [
              { status: SeatStatus.LOCKED },
              { lockExpiresAt: { [Op.lt]: now } },   
            ],
          },
        ],
      },
    });

    if (seats.length !== dto.seatIds.length) {
      throw new BadRequestException('One or more seats are not available');
    }

    await this.seatModel.update(
      { status: SeatStatus.AVAILABLE, lockExpiresAt: null },
      {
        where: {
          id: dto.seatIds,
          status: SeatStatus.LOCKED,
          lockExpiresAt: { [Op.lt]: now },
        },
      },
    );

    const lockExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const [lockCount] = await this.seatModel.update(
      { status: SeatStatus.LOCKED, lockExpiresAt },
      {
        where: {
          id: dto.seatIds,
          status: SeatStatus.AVAILABLE,
        },
      },
    );

    if (lockCount !== dto.seatIds.length) {
      throw new BadRequestException('Could not lock all seats. Try again.');
    }

    const booking = await this.bookingModel.create({
      userId,
      eventId,
      status: BookingStatus.PENDING,
      expiresAt: lockExpiresAt,
      seats: seats.map(s => ({
        seatId: s.id,
        seatNumber: s.seatNumber,
      })),
    });

    return booking;
  }


  async confirmBooking(userId: string, bookingId: string) {
    const booking = await this.bookingModel.findByPk(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    console.log('Booking.userId:', booking.userId);
    console.log('Requesting userId:', userId);
    if (booking.userId !== userId) throw new ForbiddenException('Not your booking');
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Booking cannot be confirmed');
    }

    const seatIds = booking.seats.map(s => s.seatId);
    await this.seatModel.update(
      { status: SeatStatus.BOOKED, lockExpiresAt: null },
      { where: { id: seatIds } },
    );

    booking.status = BookingStatus.CONFIRMED;
    booking.expiresAt = null;
    await booking.save();
    return booking;
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.bookingModel.findByPk(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException('Not your booking');

    const seatIds = booking.seats.map(s => s.seatId);
    await this.seatModel.update({ status: SeatStatus.AVAILABLE, lockExpiresAt: null }, { where: { id: seatIds } });

    booking.status = BookingStatus.CANCELLED;
    await booking.save();
    return booking;
  }

  async getMyBookings(userId: string) {
    return this.bookingModel.findAll({ where: { userId } });
  }

  async getBookingById(userId: string, bookingId: string, isAdmin = false) {
    const booking = await this.bookingModel.findByPk(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (!isAdmin && booking.userId !== userId) throw new ForbiddenException('Not authorized');
    return booking;
  }

  async unlockExpiredBookings() {
    const now = new Date();

    const expiredBookings = await this.bookingModel.findAll({
      where: {
        status: BookingStatus.PENDING,
        expiresAt: { [Op.lt]: now },
      },
    });

    if (!expiredBookings.length) return; 
    const allSeatIds: string[] = [];
    expiredBookings.forEach(b => {
      const seatIds = (b.seats || []).map((s: any) => s.seatId);
      allSeatIds.push(...seatIds);
    });

    if (allSeatIds.length) {
      await this.seatModel.update(
        { status: SeatStatus.AVAILABLE, lockExpiresAt: null },
        { where: { id: allSeatIds } }
      );
    }

    const bookingIds = expiredBookings.map(b => b.id);
    await this.bookingModel.update(
      { status: BookingStatus.EXPIRED },
      { where: { id: bookingIds } }
    );

    expiredBookings.forEach(b => {
      this.logger.log(`Booking ${b.id} expired and seats released`);
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleExpiredBookings() {
    this.logger.log('Running cron: check expired bookings...');
    await this.unlockExpiredBookings();
  }
}
