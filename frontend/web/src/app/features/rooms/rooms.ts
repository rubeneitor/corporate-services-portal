import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { RoomsService } from '../../core/services/rooms.service';
import { Room } from '../../shared/models/room.model';
import { AuthService } from '../../core/services/auth.service';
import { RoomForm } from './room-form/room-form';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
  ],
  templateUrl: './rooms.html',
  styleUrls: ['./rooms.scss'],
})
export class Rooms implements OnInit {
  private roomsService = inject(RoomsService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  rooms = signal<Room[]>([]);
  filteredRooms = signal<Room[]>([]);
  readonly canCreateRooms = this.authService.canCreateRooms;
  readonly canUpdateRooms = this.authService.canUpdateRooms;
  readonly canDeleteRooms = this.authService.canDeleteRooms;
  readonly displayedColumns = computed(() => {
    const columns = ['name', 'capacity', 'price', 'description'];

    if (this.canUpdateRooms() || this.canDeleteRooms()) {
      columns.push('actions');
    }

    return columns;
  });

  searchText = '';
  minCapacity: number | null = null;

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomsService.getAll().subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
        this.filterRooms();
      },
      error: (err) => console.error('Error loading rooms:', err),
    });
  }

  filterRooms(): void {
    const minCapacity = this.minCapacity ?? 0;
    this.filteredRooms.set(
      this.rooms().filter((room) => {
        const matchesSearch = room.name.toLowerCase().includes(this.searchText.toLowerCase());
        const matchesCapacity = room.capacity >= minCapacity;
        return matchesSearch && matchesCapacity;
      }),
    );
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(RoomForm, {
      width: '500px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
      if (result) {
        this.loadRooms();
      }
    });
  }

  openEditDialog(room: Room): void {
    const dialogRef = this.dialog.open(RoomForm, {
      width: '500px',
      data: room,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRooms();
      }
    });
  }

  deleteRoom(id: string): void {
    Swal.fire({
      html: '¿Seguro que quieres eliminar esta sala?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.roomsService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Sala eliminada!',
              icon: 'success',
            });
            this.loadRooms();
          },
          error: (err) => alert('Error deleting room: ' + err.error.message),
        });
      }
    });
  }
}
