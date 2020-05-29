import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';

import { isBefore, subHours } from 'date-fns';

import User from './User';

@Entity()
class Appointments {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  date: Date;

  @ManyToOne(() => User, (user) => user.appointments, {
    onDelete: 'SET NULL',
  })
  provider: User;

  @ManyToOne(() => User, (user) => user.appointments, {
    onDelete: 'SET NULL',
  })
  user: User;

  @Column({ type: 'date', nullable: true })
  canceledAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  protected past: Boolean;
  protected cancelable: Boolean;

  @AfterLoad()
  getPaste() {
    this.past = isBefore(this.date, new Date());
  }

  @AfterLoad()
  getCancelable() {
    this.cancelable = isBefore(new Date(), subHours(this.date, 2));
  }
}

export default Appointments;
