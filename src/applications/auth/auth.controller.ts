import { LoginDTO, RegisterDTO } from './../../infrastructures/dto/auth';
import { AuthService } from './auth.service';
import { Controller, HttpStatus } from '@nestjs/common';
import { Body, Get, HttpCode, Post } from '@nestjs/common/decorators/http';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAccessGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Get('check')
  async check() {
    return { message: 'OK' };
  }
}
