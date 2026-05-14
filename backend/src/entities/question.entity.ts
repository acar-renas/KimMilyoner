import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('questions') // PostgreSQL'de tablonun adı "questions" olacak
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  questionText: string;

  @Column()
  optionA: string;

  @Column()
  optionB: string;

  @Column()
  optionC: string;

  @Column()
  optionD: string;

  @Column({ length: 1 }) // A, B, C veya D gibi tek harf olacak
  correctAnswer: string;

  @Column({ type: 'int', default: 1 })
  difficultyLevel: number; // 1 (Çok kolay) ile 12 (Milyonluk soru) arası
}
