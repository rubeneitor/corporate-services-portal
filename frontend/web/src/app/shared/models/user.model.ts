export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
