import { Module, Post } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostRepository } from "./repositories/post.repository";
import { PostService } from "./services/post.service";

@Module({
    imports: [TypeOrmModule.forFeature([Post]),],
    providers: [PostRepository, PostService],
    exports: [TypeOrmModule]
})
export class PostModule { }