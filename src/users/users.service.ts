import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ where: { email } });
    }

    async getUserById(id: string) {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'User not found',
                    data: null
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'User fetched successfully',
            data: user,
        };
    }

    async create(dto: CreateUserDto) {
        try {
            const existingUser = await this.getUserByEmail(dto.email);
            if (existingUser) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        message: 'Email already exists',
                        data: null,
                    },
                    HttpStatus.CONFLICT,
                );
            }

            const hashedPassword = await bcrypt.hash(dto.password, 10);

            const user = await this.userModel.create({
                email: dto.email,
                password: hashedPassword,
                role: dto.role || 'customer',
            });

            return {
                statusCode: HttpStatus.CREATED,
                message: 'User created successfully',
                data: user,
            };
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        message: 'Email must be unique',
                        data: null,
                    },
                    HttpStatus.CONFLICT,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                    data: null,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
