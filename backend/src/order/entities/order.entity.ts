// src/orders/entities/order.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from '../../films/entities/film.entity';
import { Schedule } from 'src/films/entities/schedule.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  filmId: string;

  @ManyToOne(() => Film)
  @JoinColumn({ name: 'filmId' })
  film: Film;

  @Column('uuid')
  sessionId: string;

  @ManyToOne(() => Schedule)
  @JoinColumn({ name: 'sessionId' })
  session: Schedule;

  @Column({ type: 'timestamp' })
  daytime: Date;

  @Column()
  row: number;

  @Column()
  seat: number;

  @Column()
  price: number;
}
