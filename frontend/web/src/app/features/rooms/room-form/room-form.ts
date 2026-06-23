import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomsService } from '../../../core/services/rooms.service';
import { Rooms } from '../rooms';
import { Room, RoomType } from '../../../shared/models/room.model';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { validate } from '@angular/forms/signals';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-room-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './room-form.html',
  styleUrl: './room-form.scss',
})
export class RoomForm {
  private readonly roomService = inject(RoomsService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private dialogRef = inject(MatDialogRef<RoomForm>);
  private data = inject(MAT_DIALOG_DATA);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    capacity: [null, [Validators.required]],
    pricePerHour: [null, [Validators.required]],
    description: [''],
    type: ['MEETING' as RoomType, [Validators.required]]
  });

  isEdit = !!this.data; 

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    const dto = {
      name: value.name ?? '',
      capacity: Number(value.capacity),
      pricePerHour: Number(value.pricePerHour),
      description: value.description ?? '',
      type: value.type ?? 'MEETING'
    }

      const request = this.isEdit
      ? this.roomService.update(this.data.id, dto)
      : this.roomService.create(dto);

       request.subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.errorMessage.set('Error al guardar la sala');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
