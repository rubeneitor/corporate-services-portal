import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Min } from 'class-validator';
import { RoomType } from '../room.entity';

export class CreateRoomDto {
  @ApiProperty({
    example: 'Sala Valencia',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 8,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    enum: RoomType,
    example: RoomType.MEETING,
  })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({
    example: 10
  })
  @IsInt()
  @Min(1)
  pricePerHour: number;

  @ApiProperty({
    example: 'Sala de meeting para 10 personas'
  })
  @IsString()
  description: string;



}
