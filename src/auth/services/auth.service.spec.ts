import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockResponse = () => {
    return {
      cookie: jest.fn(),
    } as any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserLogin', () => {
    it('should login successfully and return token', async () => {
      const res = mockResponse();

      const user = {
        id: 1,
        email: 'test@mail.com',
        password: 'hashed',
        isActive: true,
      };

      userRepository.findByEmail.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.getUserLogin(res, {
        email: 'test@mail.com',
        password: '123456',
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        token: 'jwt-token',
      });

      expect(res.cookie).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id });
    });

    it('should throw if user not found', async () => {
      const res = mockResponse();

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.getUserLogin(res, {
          email: 'test@mail.com',
          password: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if user is inactive', async () => {
      const res = mockResponse();

      userRepository.findByEmail.mockResolvedValue({
        id: 1,
        isActive: false,
      } as any);

      await expect(
        service.getUserLogin(res, {
          email: 'test@mail.com',
          password: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if password is invalid', async () => {
      const res = mockResponse();

      userRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        password: 'hashed',
        isActive: true,
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.getUserLogin(res, {
          email: 'test@mail.com',
          password: 'wrong',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      const res = mockResponse();

      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const createdUser = {
        id: 1,
        email: 'test@mail.com',
        name: 'Test',
      };

      userRepository.createUser.mockResolvedValue(createdUser as any);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.registerUser(res, {
        email: 'test@mail.com',
        name: 'Test',
        password: '123456',
      });

      expect(result).toEqual({
        ...createdUser,
        token: 'jwt-token',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(res.cookie).toHaveBeenCalled();
    });

    it('should throw if user already exists', async () => {
      const res = mockResponse();

      userRepository.findByEmail.mockResolvedValue({ id: 1 } as any);

      await expect(
        service.registerUser(res, {
          email: 'test@mail.com',
          name: 'Test',
          password: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('checAuthStatus', () => {
    it('should return user with token', async () => {
      const user = {
        id: 1,
        email: 'test@mail.com',
      };

      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.checAuthStatus(user as any);

      expect(result).toEqual({
        ...user,
        token: 'jwt-token',
      });

      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id });
    });
  });
});