import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((module) => module.Login),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((module) => module.Dashboard),
      },
      {
        path: 'rooms',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/rooms/rooms').then((m) => m.Rooms),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/rooms/room-form/room-form').then((m) => m.RoomForm),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/rooms/room-form/room-form').then((m) => m.RoomForm),
          },
        ],
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./features/reservations/reservations').then((module) => module.Reservations),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
