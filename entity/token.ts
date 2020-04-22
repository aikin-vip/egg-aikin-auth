import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('IDX_b95cd28e9bf58b05f50e4ff909', [ 'refreshToken' ], { unique: true })
@Index('IDX_d5b9f4694521b7fbb121aff385', [ 'accessToken' ], { unique: true })
@Index('token_access_token_uindex', [ 'accessToken' ], { unique: true })
@Index('token_refresh_token_uindex', [ 'refreshToken' ], { unique: true })
@Entity('token')
export class Token {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  id: string;

  @Column('int', { name: 'uid', unsigned: true, default: () => "'0'" })
  uid: number;

  @Column('varchar', { name: 'access_token', unique: true, length: 100 })
  accessToken: string;

  @Column('datetime', {
    name: 'access_token_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  accessTokenAt: Date;

  @Column('varchar', { name: 'refresh_token', unique: true, length: 100 })
  refreshToken: string;

  @Column('datetime', {
    name: 'refresh_token_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  refreshTokenAt: Date;

  @Column('tinyint', { name: 'type', unsigned: true, default: () => "'0'" })
  type: number;
}
