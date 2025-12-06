import { Controller, Post, Body, Get, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@ApiBearerAuth('JWT')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() body: LoginUserDto) {
        return this.authService.login(body.email, body.password);
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Access token refreshed successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refreshToken(@Body() body: RefreshTokenDto) {
        const { refreshToken } = body;
        return this.authService.refreshToken(refreshToken);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    @ApiResponse({ status: 200, description: 'Get current user info' })
    @ApiOperation({ summary: 'Get current user info' })
    async me(@Req() req: any) {
        return {
            statusCode: 200,
            data: req.user,
        };
    }
}
