import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            getUsers: jest.fn(),
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUsers', () => {
    it('should return users with pagination', async () => {
      const paginationDto = {
        page: 1,
        limit: 10,
      };

      const users = [
        { id: 1, email: 'test1@mail.com' },
        { id: 2, email: 'test2@mail.com' },
      ];

      userRepository.getUsers.mockResolvedValue(users as any);

      const result = await service.findUsers(paginationDto);

      expect(result).toEqual(users);
      expect(userRepository.getUsers).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      const user = {
        id: 1,
        email: 'test@mail.com',
      };

      userRepository.getUserById.mockResolvedValue(user as any);

      const result = await service.findById(1);

      expect(result).toEqual(user);
      expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
      expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    });
  });
});