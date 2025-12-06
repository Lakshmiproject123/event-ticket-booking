// import { ApiProperty } from '@nestjs/swagger';
// import { UserRole } from '../users.model';
// import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

// export class CreateUserDto {
//   @ApiProperty({ example: 'user@example.com' })
//   @IsEmail()
//   email: string;

//   @ApiProperty({ example: 'Password@123', minLength: 6 })
//   @IsString()
//   @MinLength(6)
//   password: string;

//   @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
//   @IsEnum(UserRole)
//   role: UserRole;
// }
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../users.model';
import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'Password@123', minLength: 6 })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole;
}
