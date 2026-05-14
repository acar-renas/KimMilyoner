import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Supabase'den aldığınız "Connection string (URI)" adresini aşağıdaki tırnakların içine yapıştırın.
      // Supabase IPv4 desteklemesi için Connection Pooler URL'si (Port 6543 ve postgres.projekodu)
      url: 'postgresql://postgres.bepojjxgbpfodwzhohfn:Renas1232acar@aws-1-eu-central-1.pooler.supabase.com:6543/postgres',
      ssl: {
        rejectUnauthorized: false, // Supabase gibi uzak sunucular için SSL zorunludur
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Geliştirme ortamında: Entity'den tablo oluşturur
    }),
    QuestionModule,
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
