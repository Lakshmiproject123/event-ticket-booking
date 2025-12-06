import { Injectable, NotFoundException, BadRequestException,HttpException,HttpStatus } from '@nestjs/common';
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

        try {
            const createdSeats = await this.seatModel.bulkCreate(seats);
            return {
                statusCode: 201,
                message: 'Seats created successfully',
                data: createdSeats,
            };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new HttpException(
                    'One or more seats already exist for this event',
                    HttpStatus.CONFLICT,
                );
            }
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    async getSeats(eventId: string) {
        const seats = await this.seatModel.findAll({ where: { eventId } });

        if (!seats.length) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'No seats found for this event',
                data: null,
            });
        }

        return {
            statusCode: 200,
            message: 'Seats fetched successfully',
            data: seats,
        };
    }

    async getAvailableSeats(eventId: string) {
        const now = new Date();

        const availableSeats = await this.seatModel.findAll({
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

        return {
            statusCode: 200,
            message: 'Available seats fetched successfully',
            data: availableSeats,
        };
    }

    async updateSeat(seatId: string, dto: UpdateSeatDto, userId: string, userRole: string) {
        const seat = await this.seatModel.findByPk(seatId);

        if (!seat) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Seat not found',
                data: null,
            });
        }

        if (userRole !== UserRole.ADMIN && dto.status === SeatStatus.BOOKED) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Cannot mark seat as booked directly',
            });
        }

        if (dto.status) seat.status = dto.status;
        seat.lockExpiresAt = dto.lockExpiresAt || null;

        await seat.save();

        return {
            statusCode: 200,
            message: 'Seat updated successfully',
            data: seat,
        };
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

        return {
            statusCode: 200,
            message: 'Expired seats unlocked successfully',
        };
    }
}
