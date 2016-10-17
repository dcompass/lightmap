/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const schema = new Schema({
  uuid: { type: String, required: true, unique: true },
  boundaryId: { type: String, required: true },
  bounds: {
    type: mongoose.Schema.Types.Mixed, default: {
      _southWest: { lat: 0, lng: 0 },
      _northEast: { lat: 0, lng: 0 }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model('boundaryRects', schema);
