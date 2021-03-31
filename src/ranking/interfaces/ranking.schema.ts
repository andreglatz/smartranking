import { Schema } from 'mongoose';

export const RankingSchema = new Schema(
  {
    ranking: { type: String, unique: true },
    description: String,
    events: [
      {
        name: String,
        operation: String,
        value: Number,
      },
    ],
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'players',
      },
    ],
  },
  { timestamps: true, collection: 'rankings' },
);
