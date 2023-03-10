import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroORM } from '@mikro-orm/core';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import createTestModule from '../../../../test/helpers/TestModuleHelper';
import { User } from '../../../domains/entities';
import { LoginDTO, RegisterDTO } from '../../../infrastructures/dto/auth';
import { AuthService } from '../auth.service';
import { UserRepositoryHelper } from './../../../../test/helpers/UserRepositoryHelper';
import { UserRepository } from './../../../infrastructures/repository';

describe('AuthService', () => {
  let app: TestingModule;
  let orm: MikroORM;
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    app = await createTestModule({
      entities: [User],
      providers: [AuthService],
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get<string>('JWT_ACCESS_SECRET'),
            signOptions: {
              expiresIn: config.get<string>('JWT_ACCESS_EXPIRES'),
            },
          }),
        }),
      ],
    });

    orm = app.get<MikroORM>(MikroORM);
    authService = app.get<AuthService>(AuthService);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await orm.getSchemaGenerator().clearDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
    await app.close();
  });

  describe('register', () => {
    it('should throw BadRequestException when the user is already exists', async () => {
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

  describe('login', () => {
    it('should throw Forbidden when credentials is invalid', async () => {
      // Arrange
      const payload: LoginDTO = {
        email: 'test@gmail.com',
        password: 'wrong_password',
      };

      // Action & Assert
      await expect(() => authService.login(payload)).rejects.toThrowError(
        ForbiddenException,
      );
    });

    it('should return access_token and refresh_token', async () => {
      // Arrange
      const payload: LoginDTO = {
        email: 'john@gmail.com',
        password: 'valid_password',
      };

      await UserRepositoryHelper.createUser(
        userRepository,
        {
          email: payload.email,
          password: payload.password,
        },
        { hashPassword: true },
      );

      // Action
      const { access_token, refresh_token } = await authService.login(payload);

      expect(access_token).toBeDefined();
      expect(refresh_token).toBeDefined();
    });
  });

  describe('generateTokens', () => {
    it('should return access_token and refresh_token', async () => {
      // Arrange
      const payload = {
        sub: 1,
        email: 'smith@gmail.com',
        fullName: 'Adam Smith',
      };

      // Action
      const { access_token, refresh_token } = await authService.generateTokens(
        payload,
      );

      // Assert
      expect(access_token).toBeDefined();
      expect(refresh_token).toBeDefined();
    });
  });
});
