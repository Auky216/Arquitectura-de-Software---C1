import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {  QueryUserDto } from './dto/query-user.dto';
import {  UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users -> lista de usuarios
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() queryDto: QueryUserDto) {
    return this.usersService.findAll(queryDto);
  }

  // GET /users/{document} -> detalle del usuario
  @Get(':document')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('document') document: string) {
    return this.usersService.findOne(document);
  }

  // POST /users -> crear usuario
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // PUT /users -> actualizar usuario
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  // DELETE /users/{document} -> eliminar usuario (método adicional)
  @Delete(':document')
  @HttpCode(HttpStatus.OK)
  remove(@Param('document') document: string) {
    return this.usersService.remove(document);
  }

  // GET /users/stats -> estadísticas (método adicional para call center)
  @Get('stats/summary')
  @HttpCode(HttpStatus.OK)
  getStats() {
    return this.usersService.getStats();
  }
}