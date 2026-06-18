import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ReservationsService } from './reservation.service';


@Controller('reservations')
export class ReservationsController {
  constructor(private service: ReservationsService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create(body, req.user.userId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}