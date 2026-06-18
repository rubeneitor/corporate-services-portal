import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('rooms')
@ApiBearerAuth()
@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private service: RoomsService) {}

  // -------------------------
  // CREATE (solo ADMIN)
  // -------------------------
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateRoomDto) {
    return this.service.create(dto);
  }

  // -------------------------
  // GET ALL
  // ADMIN + MANAGER + USER
  // -------------------------
  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  findAll() {
    return this.service.findAll();
  }

  // -------------------------
  // GET ONE
  // -------------------------
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // -------------------------
  // UPDATE (ADMIN + MANAGER)
  // -------------------------
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.service.update(id, dto);
  }

  // -------------------------
  // DELETE (solo ADMIN)
  // -------------------------
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
