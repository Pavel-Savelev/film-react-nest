import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from '../../films/entities/film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'film_id', type: 'uuid' })
  filmId: string;

  @Column({ type: 'timestamp' })
  daytime: Date;

  @Column()
  hall: string;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text', { array: true, default: [] })
  taken: string[];

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // Связь многие-к-одному с фильмами
  @ManyToOne(() => Film, (film) => film.schedules)
  @JoinColumn({ name: 'film_id' })
  film: Film;
}
