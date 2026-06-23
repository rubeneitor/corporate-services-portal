export type RoomType = 'MEETING' | 'GYM' | 'DINING' | 'OFFICE';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: RoomType;
  pricePerHour: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomDto {
  name: string;
  capacity: number;
  type: RoomType;
  pricePerHour: number;
  description?: string;
}

export interface UpdateRoomDto {
  name?: string;
  capacity?: number;
  type?: RoomType;
  pricePerHour?: number;
  description?: string;
}
