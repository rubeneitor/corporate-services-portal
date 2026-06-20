import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 50 })
  pricePerHour: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}