import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('scores') // PostgreSQL'de tablonun adı "scores" olacak
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerName: string;

  @Column({ type: 'int', default: 0 })
  prizeWon: number;

  @CreateDateColumn() // Kayıt oluştuğu anki tarihi otomatik atar
  playedAt: Date;
}
