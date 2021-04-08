import { Schema } from 'mongoose';

export const MatchSchmea = new Schema(
  {
    ranking: { type: String },
    players: [{ type: Schema.Types.ObjectId, ref: 'players' }],
    winner: { type: Schema.Types.ObjectId, ref: 'players' },
    result: [{ set: { type: String } }],
  },
  { timestamps: true, collection: 'matches' },
);
