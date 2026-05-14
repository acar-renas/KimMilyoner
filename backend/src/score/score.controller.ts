import { Controller, Get, Post, Body } from '@nestjs/common';
import { ScoreService } from './score.service';
import { Score } from '../entities/score.entity';

@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  getLeaderboard() {
    return this.scoreService.findTopScores();
  }

  @Post()
  saveScore(@Body() body: Partial<Score>) {
    return this.scoreService.create(body);
  }
}
