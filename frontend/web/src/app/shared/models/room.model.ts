export interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomDto {
  name: string;
  capacity: number;
  pricePerHour: number;
  description?: string;
}

export interface UpdateRoomDto {
  name?: string;
  capacity?: number;
  pricePerHour?: number;
  description?: string;
}
