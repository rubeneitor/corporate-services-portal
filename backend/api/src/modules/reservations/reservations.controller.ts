import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private service: ReservationsService) {}

  @Post()
  create(@Body() dto: CreateReservationDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
