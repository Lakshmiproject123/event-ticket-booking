// import { ApiProperty } from '@nestjs/swagger';
// import { IsEmail, IsString } from 'class-validator';

// export class LoginUserDto {
//   @ApiProperty({ example: 'admin@example.com' })
//   @IsEmail()
//   email: string;

//   @ApiProperty({ example: 'Admin@123' })
//   @IsString()
//   password: string;
// }
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'Admin@123' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
