import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../entities/score.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private scoreRepo: Repository<Score>,
  ) {}

  // En yüksek 10 skoru getirir (Liderlik Tablosu)
  findTopScores(): Promise<Score[]> {
    return this.scoreRepo.find({
      order: { prizeWon: 'DESC' },
      take: 10,
    });
  }

  // Oyuncu oyunu bitirdiğinde yeni skor kaydeder
  create(scoreData: Partial<Score>): Promise<Score> {
    const newScore = this.scoreRepo.create(scoreData);
    return this.scoreRepo.save(newScore);
  }
}
