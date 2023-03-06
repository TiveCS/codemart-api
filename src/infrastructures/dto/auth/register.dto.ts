import { IsEmail, IsString } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  password: string;
}
