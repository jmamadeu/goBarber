import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';

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

  protected url: string;

  @AfterLoad()
  getUrl() {
    this.url = `http://localhost:3333/files/${this.path}`;
  }
}

export default File;
