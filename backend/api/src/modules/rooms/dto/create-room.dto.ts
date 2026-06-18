import { IsEnum, IsInt, IsString, Min } from 'class-validator';
import { RoomType } from '../room.entity';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsEnum(RoomType)
  type: RoomType;
}