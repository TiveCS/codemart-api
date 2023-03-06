import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/domains/entities';
import { AuthService } from './auth.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [AuthService],
})
export class AuthModule {}
