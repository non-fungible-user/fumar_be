import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor(private httpService: HttpService) {}

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
