import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a reservation' })
  create(@Body() dto: CreateReservationDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my reservations' })
  findMine(@Req() req: any) {
    return this.service.findByUser(req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel one of my reservations' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.cancel(id, req.user.userId);
  }
}
