import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
  ) {}

  create(dto: CreateRoomDto) {
    const room = this.roomRepo.create(dto);
    return this.roomRepo.save(room);
  }

  findAll() {
    return this.roomRepo.find();
  }

  async findOne(id: string) {
    const room = await this.roomRepo.findOne({ where: { id } });

    if (!room) throw new NotFoundException('Room not found');

    return room;
  }

  async update(id: string, dto: UpdateRoomDto) {
    const room = await this.findOne(id);

    Object.assign(room, dto);

    return this.roomRepo.save(room);
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    return this.roomRepo.remove(room);
  }
}