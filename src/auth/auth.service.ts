import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(email: string, password: string) {
        try {
            const user = await this.usersService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }

            const accessToken = this.jwtService.sign({ sub: user.id, role: user.role }, { expiresIn: '1h' });
            const refreshToken = this.jwtService.sign({ sub: user.id, role: user.role }, { expiresIn: '7d' });

            return {
                statusCode: HttpStatus.OK,
                message: 'Login successful',
                data: { accessToken, refreshToken },
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async refreshToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.usersService.getUserById(payload.sub);

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const accessToken = this.jwtService.sign(
                { sub: user.data.id, role: user.data.role },
                { expiresIn: '1h' },
            );


            return {
                statusCode: HttpStatus.OK,
                message: 'Access token refreshed',
                data: { accessToken },
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED);
            }
            throw new HttpException(error.message || 'Failed to refresh token', HttpStatus.UNAUTHORIZED);
        }
    }
}
