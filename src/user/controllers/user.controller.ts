import { Controller, Get, Param, Query } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/shared/dtos/pagination.dto";

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    findUsers(@Query() paginationDto: PaginationDto) {
        return this.userService.findUsers(paginationDto)
    }

    @Get(':id')
    findUserById(@Param('id') id: number) {
        return this.userService.findById(id)
    }
}