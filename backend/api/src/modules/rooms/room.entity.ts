import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum RoomType {
  MEETING = 'MEETING',
  GYM = 'GYM',
  DINING = 'DINING',
  OFFICE = 'OFFICE',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.MEETING,
  })
  type: RoomType;

  @Column({ default: true })
  isActive: boolean;
}