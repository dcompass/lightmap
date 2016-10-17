/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const schema = new Schema({
  uuid: { type: String, required: true },
  type: { type: String, enum: ['instructor', 'client', ''], default: 'instructor' },
  tracking: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  latlng: { type: [Number], default: [0, 0], index: '2d' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model('markeruser', schema);
