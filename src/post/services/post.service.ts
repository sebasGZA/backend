import { PaginationDto } from "src/shared/dtos/pagination.dto";
import { CreatePostDto } from "../dtos/create-post.dto";
import { PostRepository } from "../repositories/post.repository";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdatePostDto } from "../dtos/update-post.dto";

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository) { }

    createPost(createPostDto: CreatePostDto, userId: number) {
        return this.postRepository.createPost(createPostDto, userId);
    }

    getAllPosts(paginationDto: PaginationDto) {
        return this.postRepository.getPosts(paginationDto);
    }

    async getPostById(id: number) {
        const post = await this.postRepository.getPostById(id);
        if (!post) throw new NotFoundException('Post not found');
        return {
            ...post,
            userId: post?.user.id,
            userName: post?.user.name
        };;
    }

    async patchPost(id: number, updateDto: UpdatePostDto) {
        try {
            const postDb = await this.postRepository.getPostById(id);
            if (!postDb) throw new NotFoundException('Post not found');
            const postToUpdate = {
                ...postDb,
                ...updateDto,
                id,
            };
            await this.postRepository.update(id, postToUpdate)
            return this.postRepository.getPostById(id);
        } catch (err) {
            throw new InternalServerErrorException('Error updating post, call admin');
        }
    }

    async deletePost(id: number) {
        await this.getPostById(id);
        await this.postRepository.delete(id);
        return id;
    }
}