import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeeder implements OnApplicationBootstrap {
  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    const existingAdmin = await this.usersService.getUserByEmail('admin@example.com');

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      await this.usersService.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      console.log('Default admin created: admin@example.com / Admin@123');
    }
  }
}
