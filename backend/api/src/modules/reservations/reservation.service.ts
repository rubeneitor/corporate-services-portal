import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

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

  async create(dto: CreateReservationDto, userId: string) {
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

  async findByUser(userId: string) {
    return this.reservationRepo.find({
      where: {
        userId,
      },
      relations: {
        room: true,
      },
      order: {
        startDate: 'ASC',
      },
    });
  }

  async cancel(id: string, userId: string) {
    const reservation = await this.reservationRepo.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.reservationRepo.remove(reservation);
  }
}
