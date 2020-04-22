import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('admin_email_index', [ 'email' ], {})
@Index('admin_mobile_index', [ 'mobile' ], {})
@Index('admin_username_index', [ 'username' ], {})
@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'username', length: 50 })
  username: string;

  @Column('varchar', { name: 'email', length: 50 })
  email: string;

  @Column('varchar', { name: 'mobile', length: 50 })
  mobile: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

}
