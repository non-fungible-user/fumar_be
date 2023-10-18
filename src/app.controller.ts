import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';
import { ScoresService } from './scores.service';

export class CreateScoreDto {
  @IsString()
  address: string;

  @IsNumber()
  score: number;
}

@Controller('app')
export class AppController {
  constructor(private httpService: HttpService, private scoresService: ScoresService) {}

  @Post('')
  createScore(@Body() createScoreDto: CreateScoreDto) {
    const { address, score } = createScoreDto;
    
    return this.scoresService.createOrUpdateScore(address, score)
      .then(() => {
        return {
          message: 'Score created successfully',
          address,
          score,
        };
      })
      .catch(err => {
        return {
          message: 'Error creating score',
          error: err.message,
        };
      });
  }

  @Get('top')
  async getTopScores() {
    const topScores = await this.scoresService.getTopScores(10);
    return {
      message: 'Top 10 scores retrieved successfully',
      topScores,
    };
  }

  @Get(':param')
  async getNFTs(@Param('param') param: string) {
    try {
      const apiUrl = `https://q911c3yhyc.execute-api.us-east-1.amazonaws.com/prod/v1/wallets/${param}/nfts`;
      const apiKey = 'yDw1B4UnqHauqU4gQpIEp960cmp3wviu4ZIgtzcW';
      const result = await this.httpService.axiosRef.get(apiUrl, {
        headers: {
          'X-API-KEY': apiKey,
        },
      });

      const data = result.data;
      const keyToFind = 'stupidos';

      if (data.nftHolding && data.nftHolding[keyToFind]) {
        return { result: true };
      }

      return { result: false };
    } catch (error) {
      return { result: false };
    }
  }
}
