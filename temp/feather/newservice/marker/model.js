/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const schema = new Schema({
  uuid: { type: String, required: true },
  boundaryId: { type: String, required: true },
  type: { type: String, default: '' },
  tracking: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  latlng: [Number],
  detail: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model('markers', schema);
