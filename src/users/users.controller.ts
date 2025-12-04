import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation,ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Get(':email')
    async findByEmail(@Param('email') email: string) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            return { message: 'User not found' };
        }
        return user;
    }
}
