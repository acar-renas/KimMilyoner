import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from '../entities/score.entity';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  providers: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
