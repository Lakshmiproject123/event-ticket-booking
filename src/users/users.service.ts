import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) { }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ where: { email } });
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userModel.findByPk(id);
    }

    //   async create(data: { email: string; password: string; role: string }): Promise<User> {
    //     try {
    //       const existingUser = await this.getUserByEmail(data.email);
    //       if (existingUser) {
    //         throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    //       }

    //       return await this.userModel.create(data);
    //     } catch (error) {
    //       if (error.name === 'SequelizeUniqueConstraintError') {
    //         throw new HttpException('Email must be unique', HttpStatus.CONFLICT);
    //       }
    //       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    //   }

    //   async create(dto: CreateUserDto) {
    //     const hashedPassword = await bcrypt.hash(dto.password, 10);

    //     return this.userModel.create({
    //       email: dto.email,
    //       password: hashedPassword,
    //       role: dto.role || 'customer',
    //     });
    //   }
    async create(dto: CreateUserDto): Promise<User> {
        try {
            const existingUser = await this.getUserByEmail(dto.email);
            if (existingUser) {
                throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }

            const hashedPassword = await bcrypt.hash(dto.password, 10);

            return await this.userModel.create({
                email: dto.email,
                password: hashedPassword,
                role: dto.role || 'customer',
            });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new HttpException('Email must be unique', HttpStatus.CONFLICT);
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}


