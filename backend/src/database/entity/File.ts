import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity()
class File {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  path: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => User, user => user.avatar)
  @JoinColumn()
  user: User;

  protected url: string;

  @AfterLoad()
  getUrl() {
    this.url = `http://localhost:3333/avatar/${this.path}`;
  }
}

export default File;
