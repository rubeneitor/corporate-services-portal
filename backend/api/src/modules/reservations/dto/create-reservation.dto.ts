import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    example: '9f2f4b3c-8b4d-4a35-9a41-4c2a9a7f4f20',
  })
  @IsUUID()
  roomId: string;

  @ApiProperty({
    example: '2026-06-20T09:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2026-06-20T10:00:00.000Z',
  })
  @IsDateString()
  endDate: string;
}
