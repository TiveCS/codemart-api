import { UserRepositoryHelper } from './../../../../test/helpers/UserRepositoryHelper';
import { UserRepository } from './../../../infrastructures/repository';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import mikroOrmConfig from '../../../config/mikro-orm.config';
import { User } from '../../../domains/entities';
import { RegisterDTO } from '../../../infrastructures/dto/auth';
import { AuthService } from '../auth.service';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

describe('AuthService', () => {
  let app: TestingModule;
  let orm: MikroORM;
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MikroOrmModule.forRoot({
          ...mikroOrmConfig(),
          entities: [User],
          allowGlobalContext: true,
        }),
        MikroOrmModule.forFeature([User]),
      ],
      providers: [AuthService],
    }).compile();

    orm = app.get<MikroORM>(MikroORM);
    authService = app.get<AuthService>(AuthService);
    userRepository = app.get<UserRepository>(UserRepository);

    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterEach(async () => {
    await orm.getSchemaGenerator().clearDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
    await app.close();
  });

  describe('register', () => {
    it('should throw BadRequestException when the user is exists', async () => {
      // Arrange
      const existUserEmail = 'user@example.com';
      await UserRepositoryHelper.createUser(userRepository, {
        email: existUserEmail,
      });

      const payload: RegisterDTO = {
        email: existUserEmail,
        fullName: 'Ahmad Joko',
        password: 'encrypted_password',
      };

      // Action & Assert
      await expect(() => authService.register(payload)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should persist new user', async () => {
      // Arrange
      const payload: RegisterDTO = {
        email: 'test@gmail.com',
        fullName: 'Ahmad Joko',
        password: 'encrypted_password',
      };

      // Action
      await authService.register(payload);

      // Assert
      const { email, fullName } = await userRepository.findOne({
        email: payload.email,
      });

      expect(fullName).toEqual(payload.fullName);
      expect(email).toEqual(payload.email);
    });
  });
});
