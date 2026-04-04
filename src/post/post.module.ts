import { Module, Post } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostRepository } from "./repositories/post.repository";
import { PostService } from "./services/post.service";
import { PostController } from "./controllers/post.controller";

@Module({
    controllers: [PostController],
    imports: [TypeOrmModule.forFeature([Post]),],
    providers: [PostRepository, PostService],
    exports: [TypeOrmModule]
})
export class PostModule { }