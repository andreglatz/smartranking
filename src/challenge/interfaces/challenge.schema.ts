import { Schema } from 'mongoose';

export const ChallengeSchmea = new Schema(
  {
    dateTime: { type: Date },
    status: { type: String },
    timestampRequest: { type: Date },
    timestampResponse: { type: Date },
    requester: { type: Schema.Types.ObjectId, ref: 'players' },
    ranking: { type: String },
    players: [{ type: Schema.Types.ObjectId, ref: 'players' }],
    match: { type: Schema.Types.ObjectId, ref: 'match' },
  },
  { timestamps: true, collection: 'challengers' },
);
