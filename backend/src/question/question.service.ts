import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  // Tüm soruları listeler (Mobilden çekilecek)
  findAll(): Promise<Question[]> {
    return this.questionRepo.find();
  }

  // Yeni soru ekler (Admin veya Test için)
  create(questionData: Partial<Question>): Promise<Question> {
    const newQuestion = this.questionRepo.create(questionData);
    return this.questionRepo.save(newQuestion);
  }
}
