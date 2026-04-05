import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { UserService } from "../services/user.service";
import { PaginationDto } from "../../shared/dtos/pagination.dto";

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard())
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