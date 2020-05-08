import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

import bcrypt from 'bcryptjs';

@Entity()
class User {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column('varchar')
  passwordHash: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  provider: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  @BeforeInsert()
  generatePasswordHash() {
    if (this.passwordHash)
      this.passwordHash = bcrypt.hashSync(this.passwordHash, 8);
  }

  checkPassword(password: string) {
    return bcrypt.compareSync(password, this.passwordHash);
  }
}

export default User;
