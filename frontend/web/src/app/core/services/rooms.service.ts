import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRoomDto, Room, UpdateRoomDto } from '../../shared/models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private readonly http = inject(HttpClient);
  private apiUrl = '/api/rooms';

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getOne(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateRoomDto): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateRoomDto): Observable<Room> {
    return this.http.patch<Room>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
