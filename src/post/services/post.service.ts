import { PostRepository } from "../repositories/post.repository";

export class PostService {
    constructor(private readonly postRepository: PostRepository) { }
}