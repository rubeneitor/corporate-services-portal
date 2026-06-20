import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ReservationsService } from '../../core/services/reservations.service';
import { RoomsService } from '../../core/services/rooms.service';
import { Reservation } from '../../shared/models/reservation.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  private reservationsService = inject(ReservationsService);
  private roomsService = inject(RoomsService);

  myReservations = signal<Reservation[]>([]);
  upcomingReservations = signal<Reservation[]>([]);
  totalRooms = signal(0);
  displayedColumns = ['room', 'startDate', 'endDate', 'price'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Cargar mis reservas
    this.reservationsService.getMine().subscribe({
      next: (reservations) => {
        this.myReservations.set(reservations);
        this.filterUpcoming();
      },
      error: (err) => console.error('Error loading reservations:', err),
    });

    // Cargar total de salas
    this.roomsService.getAll().subscribe({
      next: (rooms) => {
        this.totalRooms.set(rooms.length);
      },
      error: (err) => console.error('Error loading rooms:', err),
    });
  }

  filterUpcoming(): void {
    const today = new Date();
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    this.upcomingReservations.set(this.myReservations().filter((reservation) => {
      const start = new Date(reservation.startDate);
      return start >= today && start <= in7Days;
    }));
  }

  calculatePrice(reservation: Reservation): number {
    const start = new Date(reservation.startDate).getTime();
    const end = new Date(reservation.endDate).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * (reservation.room?.pricePerHour || 0);
  }
}

