import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seat, SeatStatus } from './seats.model';
import { CreateSeatDto } from './dto/create-seats.dto';
import { UpdateSeatDto } from './dto/update-seats.dto';
import { Op } from 'sequelize';
import { UserRole } from '../users/users.model';


@Injectable()
export class SeatsService {
    constructor(@InjectModel(Seat) private seatModel: typeof Seat) { }

    async createSeats(eventId: string, dto: CreateSeatDto) {
        const seats = dto.seatNumber.map((num) => ({
            eventId,
            seatNumber: num,
            status: SeatStatus.AVAILABLE,
        }));
        return await this.seatModel.bulkCreate(seats);
    }

    async getSeats(eventId: string) {
        const seats = await this.seatModel.findAll({ where: { eventId } });
        if (!seats.length) throw new NotFoundException('No seats found for this event');
        return seats;
    }

    async getAvailableSeats(eventId: string) {
        const now = new Date();

        return await this.seatModel.findAll({
            where: {
                eventId,
                [Op.or]: [
                    { status: SeatStatus.AVAILABLE },
                    {
                        status: SeatStatus.LOCKED,
                        lockExpiresAt: { [Op.lt]: now },
                    },
                ],
            },
        });
    }

    async updateSeat(seatId: string, dto: UpdateSeatDto, userId: string, userRole: string) {
        const seat = await this.seatModel.findByPk(seatId);
        if (!seat) throw new NotFoundException('Seat not found');

        if (userRole !== UserRole.ADMIN && dto.status === SeatStatus.BOOKED) {
            throw new BadRequestException('Cannot mark seat as booked directly');
        }

        if (dto.status) seat.status = dto.status;
        seat.lockExpiresAt = dto.lockExpiresAt || null;

        await seat.save();
        return seat;
    }

    async unlockExpiredSeats() {
        const now = new Date();

        await this.seatModel.update(
            { status: SeatStatus.AVAILABLE, lockExpiresAt: null },
            {
                where: {
                    status: SeatStatus.LOCKED,
                    lockExpiresAt: { [Op.lt]: now },
                },
            },
        );
    }


}
