import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../shared/models/auth.models';
import { User } from '../../shared/models/user.model';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly currentUser = signal<User | null>(null);

  readonly isAuthenticated = computed(() => !!this.token());
  readonly user = this.currentUser.asReadonly();
  readonly userRole = computed(() => this.currentUser()?.role ?? null);
  readonly canCreateRooms = computed(() => this.userRole() === 'ADMIN');
  readonly canUpdateRooms = computed(() =>
    ['ADMIN', 'MANAGER'].includes(this.userRole() ?? ''),
  );
  readonly canDeleteRooms = computed(() => this.userRole() === 'ADMIN');

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.access_token);
        this.token.set(response.access_token);
        this.loadCurrentUser().subscribe();
      }),
    );
  }

  register(credentials: LoginRequest & { name: string }) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.access_token);
        this.token.set(response.access_token);
        this.loadCurrentUser().subscribe();
      }),
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }

  getToken() {
    return this.token();
  }

  loadCurrentUser() {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
      }),
    );
  }
}
