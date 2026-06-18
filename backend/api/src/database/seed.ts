import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../modules/users/user.entity';
import { Room, RoomType } from '../modules/rooms/room.entity';

export async function seedDatabase(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roomRepo = dataSource.getRepository(Room);

  // -------------------------
  // USERS
  // -------------------------
  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);

  const admin = userRepo.create({
    email: 'admin@corp.com',
    name: 'Admin User',
    password: adminPassword,
    role: UserRole.ADMIN,
  });

  const manager = userRepo.create({
    email: 'manager@corp.com',
    name: 'Manager User',
    password: managerPassword,
    role: UserRole.MANAGER,
  });

  await userRepo.save([admin, manager]);

  // -------------------------
  // ROOMS
  // -------------------------
  const rooms = [
    {
      name: 'Meeting Room A',
      capacity: 10,
      type: RoomType.MEETING,
    },
    {
      name: 'Gym Room',
      capacity: 20,
      type: RoomType.GYM,
    },
    {
      name: 'Dining Hall',
      capacity: 50,
      type: RoomType.DINING,
    },
  ];

  const roomEntities = roomRepo.create(rooms);
  await roomRepo.save(roomEntities);

  console.log('🌱 Database seeded successfully');
}