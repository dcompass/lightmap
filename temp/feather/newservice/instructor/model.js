/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const schema = new Schema({
  uuid: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  resorts: [String],
  languages: { type: [String], default: ['english', 'french'] },
  rate: { type: Number },
  category: [String],
  booked: { type: Schema.Types.Mixed, default: [] },
  background: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model('instructors', schema);
