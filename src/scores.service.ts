import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ScoresService {
  constructor(@InjectModel('Score') private scoreModel: Model<any>) {}

  async createScore(address: string, score: number): Promise<any> {
    const newScore = new this.scoreModel({ address, score });
    return await newScore.save();
  }

  async getTopScores(limit: number): Promise<any[]> {
    // Find the top scores, sort by score in descending order, and limit to the specified number.
    return this.scoreModel.find()
      .sort({ score: -1 })
      .limit(limit)
      .exec();
  }

  async createOrUpdateScore(address: string, score: number): Promise<any> {
    const existingScore = await this.scoreModel.findOne({ address });

    if (existingScore) {
      // Update the existing score.
      existingScore.score = score;
      await existingScore.save();
      return {
        message: 'Score updated successfully',
        address,
        score,
      };
    } else {
      // Create a new score if it doesn't exist.
      const newScore = new this.scoreModel({ address, score });
      await newScore.save();
      return {
        message: 'Score created successfully',
        address,
        score,
      };
    }
  }
}
