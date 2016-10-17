/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const schema = new Schema({
  uuid: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  color: { type: String, default: '#AAA' },
  center: { type: [Number], default: [0, 0] },
  bounds: {
    type: mongoose.Schema.Types.Mixed, default: {
      _southWest: { lat: 0, lng: 0 },
      _northEast: { lat: 0, lng: 0 }
    }
  },
  default: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model('boundary', schema);
