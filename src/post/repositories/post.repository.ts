import { DataSource, Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreatePostDto } from "../dtos/create-post.dto";
import { title } from "process";
import { PaginationDto } from "src/shared/dtos/pagination.dto";

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

    getPosts({ limit, offset }: PaginationDto) {
        return this.find({
            take: limit,
            skip: offset,
            relations: {
                user: true,
            },
            select: {
                id: true,
                title: true,
                content: true,
                user: {
                    id: true
                }
            }
        },)
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
                user: {
                    id: true
                },
            },
        });
    };

}