import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @Column({ length: 255 })
  director: string;

  @Column('decimal', { precision: 3, scale: 1 })
  rating: number;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ length: 500 })
  image: string;

  @Column({ length: 500 })
  cover: string;

  @Column({ name: 'release_date', type: 'date' })
  releaseDate: Date;

  @Column({ name: 'duration_minutes' })
  durationMinutes: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // Связь один-ко-многим с расписанием
  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedules: Schedule[];
}
