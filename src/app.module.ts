import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoreSchema } from './score.schema';
import { ScoresService } from './scores.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(
      'mongodb+srv://x7M7MdWBJEkKd1QN:q8QJKAsXaP8NwYCE@cluster0.wcgxta9.mongodb.net',
    ),
    MongooseModule.forFeature([{ name: 'Score', schema: ScoreSchema }])
  ],
  controllers: [AppController],
  providers: [AppService, ScoresService],
})
export class AppModule {}
