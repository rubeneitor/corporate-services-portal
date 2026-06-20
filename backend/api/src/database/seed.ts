import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../modules/users/user.entity';
import { Room, RoomType } from '../modules/rooms/room.entity';
import { Reservation } from '../modules/reservations/reservation.entity';

export async function seedDatabase(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roomRepo = dataSource.getRepository(Room);
  const reservationRepo = dataSource.getRepository(Reservation);

  const seedUsers = [
    {
      email: 'admin@corp.com',
      name: 'Admin User',
      password: 'admin123',
      role: UserRole.ADMIN,
    },
    {
      email: 'manager@corp.com',
      name: 'Manager User',
      password: 'manager123',
      role: UserRole.MANAGER,
    },
    {
      email: 'user@corp.com',
      name: 'Normal User',
      password: 'user123',
      role: UserRole.USER,
    },
  ];

  const savedUsers = await Promise.all(
    seedUsers.map(async (seedUser) => {
      const existingUser = await userRepo.findOne({
        where: { email: seedUser.email },
      });

      if (existingUser) {
        return existingUser;
      }

      return userRepo.save(
        userRepo.create({
          ...seedUser,
          password: await bcrypt.hash(seedUser.password, 10),
        }),
      );
    }),
  );

  const savedManager = savedUsers.find(
    (user) => user.email === 'manager@corp.com',
  );
  const savedUser = savedUsers.find((user) => user.email === 'user@corp.com');

  const rooms = [
    {
      name: 'Meeting Room A',
      capacity: 10,
      type: RoomType.MEETING,
      pricePerHour: 50,
      description:
        'Sala de reuniones para hasta 10 personas con pizarra y proyector',
    },
    {
      name: 'Meeting Room B',
      capacity: 15,
      type: RoomType.MEETING,
      pricePerHour: 75,
      description: 'Sala de reuniones grande con mesa de conferencia',
    },
    {
      name: 'Gym Room',
      capacity: 20,
      type: RoomType.GYM,
      pricePerHour: 30,
      description: 'Sala de entrenamiento con equipos de fitness basicos',
    },
    {
      name: 'Dining Hall',
      capacity: 50,
      type: RoomType.DINING,
      pricePerHour: 100,
      description: 'Comedor para eventos y conferencias',
    },
    {
      name: 'Office Space',
      capacity: 5,
      type: RoomType.OFFICE,
      pricePerHour: 40,
      description: 'Oficina individual con escritorio y conexion de internet',
    },
  ];

  const savedRooms = await Promise.all(
    rooms.map(async (room) => {
      const existingRoom = await roomRepo.findOne({
        where: { name: room.name },
      });

      return roomRepo.save(
        roomRepo.create({
          ...existingRoom,
          ...room,
        }),
      );
    }),
  );

  const reservationCount = await reservationRepo.count();

  if (reservationCount > 0 || !savedUser || !savedManager) {
    logSeedCredentials('Database seed checked successfully');
    return;
  }

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const in3Days = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  const reservations = [
    {
      user: savedUser,
      room: savedRooms[0],
      startDate: new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        9,
        0,
      ),
      endDate: new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        11,
        0,
      ),
    },
    {
      user: savedUser,
      room: savedRooms[1],
      startDate: new Date(
        in3Days.getFullYear(),
        in3Days.getMonth(),
        in3Days.getDate(),
        14,
        0,
      ),
      endDate: new Date(
        in3Days.getFullYear(),
        in3Days.getMonth(),
        in3Days.getDate(),
        16,
        0,
      ),
    },
    {
      user: savedManager,
      room: savedRooms[3],
      startDate: new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        12,
        0,
      ),
      endDate: new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        14,
        0,
      ),
    },
  ];

  await reservationRepo.save(reservationRepo.create(reservations));

  logSeedCredentials('Database seeded successfully');
}

function logSeedCredentials(message: string) {
  console.log(message);
  console.log('   Admin: admin@corp.com / admin123');
  console.log('   Manager: manager@corp.com / manager123');
  console.log('   User: user@corp.com / user123');
}
