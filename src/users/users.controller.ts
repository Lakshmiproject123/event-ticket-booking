import { Body, Controller, Get, Param, Post, UseGuards ,HttpException,HttpStatus} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new user (Admin only)' })
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    async findById(@Param('id') id: string) {
        const user = await this.usersService.getUserById(id);
        if (!user) {
            throw new HttpException(
                { message: 'User not found' },
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }
}
