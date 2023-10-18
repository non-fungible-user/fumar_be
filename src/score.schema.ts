import * as mongoose from 'mongoose';

export const ScoreSchema = new mongoose.Schema({
  address: String,
  score: Number,
});
