import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CreatePostDto } from "../dtos/create-post.dto";
import { PostService } from "../services/post.service";
import { PaginationDto } from "src/shared/dtos/pagination.dto";
import { UpdatePostDto } from "../dtos/update-post.dto";

@ApiTags('Post')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    createPost(@Body() createPostDto: CreatePostDto) {
        return this.postService.createPost(createPostDto, 2)
    }

    @Get()
    findAllPosts(@Query() paginationDto: PaginationDto) {
        return this.postService.getAllPosts(paginationDto);
    }

    @Get(':id')
    findPostById(@Param('id') id: number) {
        return this.postService.getPostById(id);
    }

    @Patch(':id')
    updatePost(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.patchPost(id, updatePostDto);
    }

    @Delete(':id')
    deletePost(@Param('id') id: number) {
        return this.postService.deletePost(id);
    }
}