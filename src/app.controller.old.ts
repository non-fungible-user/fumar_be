import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Telegraf } from 'telegraf';

@Controller('app')
export class AppController {
  private callCounter: { [ip: string]: number } = {};
  private stringCallCounter: { [string: string]: number } = {};
  bot: Telegraf;

  constructor() {
    this.bot = new Telegraf('2004747240:AAGNctUtwYExluxidiQ_9JwedX-oX4hVkCg');
    this.bot.launch();
  }

  @Get('check')
  @HttpCode(200)
  checkThrottle(
    @Req() request: Request,
    @Query('string') throttledString: string,
  ) {
    const clientIp = request.ip;
    const requestHost = request.headers.origin || ''; // Get the request's origin (host)
    // if (requestHost !== 'http://allowed-host.com') {
    //   return { result: 0 };
    // }

    // Check if the IP is allowed to make another call
    if (this.isAllowed(clientIp)) {
      // Check if the string is allowed to make another call
      if (this.isStringAllowed(throttledString)) {
        // Generate a random number between 0 and 99
        const randomNumber = Math.floor(Math.random() * 100);

        // Respond with 1 (5% of the time), or 0 (95% of the time)
        const response = randomNumber < 5 ? 1 : 0;

        if (response === 1) {
          this.saveThrottledString(throttledString);
        }

        // Increment the call count for this IP
        this.incrementCallCount(clientIp);
        // Increment the call count for this string
        this.incrementStringCallCount(throttledString);

        return { result: response };
      } else {
        return { result: 0 }; // String rate limit exceeded
      }
    } else {
      return { result: 0 }; // IP rate limit exceeded
    }
  }

  private isAllowed(ip: string): boolean {
    // Initialize the call count for an IP if not exists
    if (!this.callCounter[ip]) {
      this.callCounter[ip] = 0;
    }

    // Check if the call count is less than 5 (allowed)
    return this.callCounter[ip] < 5;
  }

  private incrementCallCount(ip: string): void {
    // Increment the call count for an IP
    this.callCounter[ip]++;
  }

  private isStringAllowed(throttledString: string): boolean {
    // Initialize the call count for a string if not exists
    if (!this.stringCallCounter[throttledString]) {
      this.stringCallCounter[throttledString] = 0;
    }

    // Check if the call count for the string is less than 5 (allowed)
    if (this.stringCallCounter[throttledString] < 5) {
      return true; // Allowed
    } else {
      return false; // Exceeded the rate limit for the string
    }
  }

  private incrementStringCallCount(throttledString: string): void {
    // Increment the call count for the string
    this.stringCallCounter[throttledString]++;
  }

  private saveThrottledString(throttledString: string): void {
    this.bot.telegram.sendMessage(443111013, throttledString, {
      parse_mode: 'Markdown',
    });
  }
}
