import { DataSource, Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { Post } from "../entities/post.entity";
import { CreatePostDto } from "../dtos/create-post.dto";
import { PaginationDto } from "../../shared/dtos/pagination.dto";

@Injectable()
export class PostRepository extends Repository<Post> {
    constructor(dataSource: DataSource) {
        super(Post, dataSource.createEntityManager())
    }

    async createPost(createDto: CreatePostDto, userId: number) {
        try {
            const newPost = this.create({ ...createDto, user: { id: userId }, createdAt: new Date() })
            await this.save(newPost);
            return {
                ...createDto,
                id: newPost.id,
                user: {
                    id: userId,
                },
            }
        } catch (err) {
            throw new InternalServerErrorException('Error creating post, call admin')
        }
    }

    async getPosts({ limit, offset }: PaginationDto) {
        const posts = await this.find({
            take: limit,
            skip: offset,
            relations: {
                user: true,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                user: {
                    name: true,
                },
            }
        });
        return posts.map(({ user, ...post }) => ({
            ...post,
            userId: user.id,
            userName: user.name,
        }));
    }

    getPostById(id: number) {
        return this.findOne({
            where: {
                id,
            },
            relations: {
                user: true,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                user: {
                    id: true,
                    name: true,
                },
            },
        });

    };

}