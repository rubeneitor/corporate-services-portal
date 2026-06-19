import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  create(user: Partial<User>) {
    const newUser = this.usersRepo.create(user);
    return this.usersRepo.save(newUser);
  }

  findById(id: string) {
  return this.usersRepo.findOne({ where: {id}});
}
}
