import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomsService } from '../../../core/services/rooms.service';
import { Rooms } from '../rooms';
import { Room } from '../../../shared/models/room.model';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { validate } from '@angular/forms/signals';

@Component({
  selector: 'app-room-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
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

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    capacity: [0, [Validators.required]],
    pricePerHour: [0, [Validators.required]],
    description: [''],
    type: ['MEETING', [Validators.required]]
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

      const request = this.isEdit
      ? this.roomService.update(this.data.id, this.form.getRawValue())
      : this.roomService.create(this.form.getRawValue());

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

    // this.roomService.create(this.form.getRawValue()).subscribe({
      
    //   next: () => {
    //     this.dialogRef.close(true)
    //   },
    //   error: () => {
    //     this.errorMessage.set('No pudo crearse la sala');
    //     this.loading.set(false);
    //   },
    //   complete: () => {
    //     this.loading.set(false);
    //   },
    // });
  }

  close() {
    this.dialogRef.close(false);
  }
}
