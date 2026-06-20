import { Room } from './room.model';

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  room?: Room;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface CreateReservationDto {
  roomId: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
}
