import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from '../entities/question.entity';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  getAllQuestions() {
    return this.questionService.findAll();
  }

  @Post()
  createQuestion(@Body() body: Partial<Question>) {
    return this.questionService.create(body);
  }
}
