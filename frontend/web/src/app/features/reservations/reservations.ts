import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { ReservationsService } from '../../core/services/reservations.service';
import { RoomsService } from '../../core/services/rooms.service';
import { Reservation } from '../../shared/models/reservation.model';
import { Room } from '../../shared/models/room.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
  ],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.scss'],
})
export class Reservations implements OnInit {
  private reservationsService = inject(ReservationsService);
  private roomsService = inject(RoomsService);
  private fb = inject(FormBuilder);

  reservationForm: FormGroup;
  myReservations = signal<Reservation[]>([]);
  rooms: Room[] = [];
  displayedColumns = ['room', 'startDate', 'endDate', 'duration', 'price', 'status', 'actions'];

  constructor() {
    this.reservationForm = this.fb.group({
      roomId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRooms();
    this.loadMyReservations();
  }

  loadRooms(): void {
    this.roomsService.getAll().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (err) => console.error('Error loading rooms:', err),
    });
  }

  loadMyReservations(): void {
    this.reservationsService.getMine().subscribe({
      next: (reservations) => {
        this.myReservations.set(reservations);
      },
      error: (err) => console.error('Error loading reservations:', err),
    });
  }

  createReservation(): void {
    if (this.reservationForm.valid) {
      const { roomId, startDate, endDate } = this.reservationForm.value;

      // Convertir a ISO 8601
      const start = new Date(startDate).toISOString();
      const end = new Date(endDate).toISOString();

      this.reservationsService.create({ roomId, startDate: start, endDate: end }).subscribe({
        next: () => {
          Swal.fire({
            title: 'Reserva creada exitosamente',
            icon: 'success',
          });
          this.reservationForm.reset();
          this.loadMyReservations();
        },
        error: (err) => alert('Error: ' + err.error.message),
      });
    }
  }

  cancelReservation(id: string): void {
    Swal.fire({
      title: '¿Deseas cancelar esta Reserva?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationsService.cancel(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Reserva cancelada!',
              icon: 'success',
            });
            this.loadMyReservations();
          },
          error: (err) => alert('Error: ' + err.error.message),
        });
      }
    });
  }

  calculateDuration(reservation: Reservation): number {
    const start = new Date(reservation.startDate).getTime();
    const end = new Date(reservation.endDate).getTime();
    return Math.round((end - start) / (1000 * 60 * 60));
  }

  calculatePrice(reservation: Reservation): number {
    return this.calculateDuration(reservation) * (reservation.room?.pricePerHour || 0);
  }

  getStatus(reservation: Reservation): string {
    const now = new Date();
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    if (now < start) return 'Próxima';
    if (now >= start && now < end) return 'En curso';
    return 'Pasada';
  }

  getStatusClass(reservation: Reservation): string {
    const status = this.getStatus(reservation);
    if (status === 'Próxima') return 'status upcoming';
    if (status === 'En curso') return 'status ongoing';
    return 'status past';
  }

  isPastReservation(reservation: Reservation): boolean {
    const now = new Date();
    const start = new Date(reservation.startDate);
    return now >= start;
  }
}
