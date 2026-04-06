import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostRepository } from '../repositories/post.repository';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('PostService', () => {
    let service: PostService;
    let repository: jest.Mocked<PostRepository>;

    const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test Content',
        user: {
            id: 10,
            name: 'John Doe',
        },
    };

    const mockPostRepository = {
        createPost: jest.fn(),
        getPosts: jest.fn(),
        getPostById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: PostRepository,
                    useValue: mockPostRepository,
                },
            ],
        }).compile();

        service = module.get<PostService>(PostService);
        repository = module.get(PostRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a post', async () => {
        const dto: any = { title: 'Test' };
        mockPostRepository.createPost.mockResolvedValue(mockPost);

        const result = await service.createPost(dto, 10);

        expect(result).toEqual(mockPost);
        expect(repository.createPost).toHaveBeenCalledWith(dto, 10);
    });

    it('should return all posts', async () => {
        const paginationDto: any = { page: 1, limit: 10 };
        mockPostRepository.getPosts.mockResolvedValue([mockPost]);

        const result = await service.getAllPosts(paginationDto);

        expect(result).toEqual([mockPost]);
        expect(repository.getPosts).toHaveBeenCalledWith(paginationDto);
    });

    it('should return a post by id with mapped fields', async () => {
        mockPostRepository.getPostById.mockResolvedValue(mockPost);

        const result = await service.getPostById(1);

        expect(result).toEqual({
            ...mockPost,
            userId: mockPost.user.id,
            userName: mockPost.user.name,
        });
    });

    it('should throw NotFoundException if post not found', async () => {
        mockPostRepository.getPostById.mockResolvedValue(null);

        await expect(service.getPostById(1)).rejects.toThrow(NotFoundException);
    });

    it('should update a post', async () => {
        const updateDto: any = { title: 'Updated' };

        mockPostRepository.getPostById.mockResolvedValue(mockPost);
        mockPostRepository.update.mockResolvedValue(undefined);
        mockPostRepository.getPostById.mockResolvedValueOnce(mockPost)
            .mockResolvedValueOnce({ ...mockPost, ...updateDto });

        const result = await service.patchPost(1, updateDto);

        expect(repository.update).toHaveBeenCalled();
        expect(result!.title).toBe('Updated');
    });

    it('should throw InternalServerErrorException if post not found inside patch', async () => {
        mockPostRepository.getPostById.mockResolvedValue(null);

        await expect(service.patchPost(1, {} as any)).rejects.toThrow(
            InternalServerErrorException,
        );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
        mockPostRepository.getPostById.mockResolvedValue(mockPost);
        mockPostRepository.update.mockRejectedValue(new Error('DB error'));

        await expect(service.patchPost(1, {} as any)).rejects.toThrow(
            InternalServerErrorException,
        );
    });

    it('should delete a post and return id', async () => {
        jest.spyOn(service, 'getPostById').mockResolvedValue(mockPost as any);
        mockPostRepository.delete.mockResolvedValue(undefined);

        const result = await service.deletePost(1);

        expect(repository.delete).toHaveBeenCalledWith(1);
        expect(result).toBe(1);
    });
});