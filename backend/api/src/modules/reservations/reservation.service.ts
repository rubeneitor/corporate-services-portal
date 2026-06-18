import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
  ) {}

  async hasConflict(roomId: string, start: Date, end: Date) {
    const conflict = await this.reservationRepo
      .createQueryBuilder('r')
      .where('r.roomId = :roomId', { roomId })
      .andWhere('r.startDate < :end', { end })
      .andWhere('r.endDate > :start', { start })
      .getOne();

    return !!conflict;
  }

  async create(dto: any, userId: string) {
    const { roomId, startDate, endDate } = dto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    const conflict = await this.hasConflict(roomId, start, end);

    if (conflict) {
      throw new BadRequestException(
        'This room is already reserved in that time range',
      );
    }

    const reservation = this.reservationRepo.create({
      roomId,
      userId,
      startDate: start,
      endDate: end,
    });

    return this.reservationRepo.save(reservation);
  }

  async findAll() {
    return this.reservationRepo.find({
      relations: {
        room: true,
        user: true,
      },
    });
  }
}