import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('user_email_index', [ 'email' ], {})
@Index('user_mobile_index', [ 'mobile' ], {})
@Index('user_username_index', [ 'username' ], {})
@Entity('user')
export class User {
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
