/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const schema = new Schema({
  name: { type: String },
  type: { type: String, enum: ['high', 'medium', ''], default: '' },
  startDate: {
    type: Date, default: function () {
      return new Date().getTime()
    }
  },
  endDate: {
    type: Date, default: function () {
      return new Date().getTime()
    }
  },
});
export default mongoose.model('seasons', schema);
