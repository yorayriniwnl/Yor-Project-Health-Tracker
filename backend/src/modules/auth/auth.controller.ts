import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  logout() {
    return { message: 'Logged out. Remove access and refresh tokens on the client.' };
  }

  @Post('forgot-password')
  forgotPassword() {
    return { message: 'Password reset email flow placeholder. Connect email provider in production.' };
  }

  @Post('reset-password')
  resetPassword() {
    return { message: 'Password reset confirmation placeholder. Store reset tokens hashed in production.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: { id: string } }) {
    return this.authService.me(req.user.id);
  }
}
