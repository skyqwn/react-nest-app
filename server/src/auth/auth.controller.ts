import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './dtos/register-user.dto';
import { LoginUserInput } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  loginEmail(@Body() loginUserInput: LoginUserInput) {
    return this.authService.loginWithEmail(loginUserInput);
  }

  @Post('register/email')
  registerEmail(@Body() registerUserInput: RegisterUserInput) {
    return this.authService.registerWithEmail(registerUserInput);
  }
}
