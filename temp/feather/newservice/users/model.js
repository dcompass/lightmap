/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const schema = new Schema({
  uuid: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true },
  avatar: { type: String, default: '' },
  username: { type: String, required: false, unique: true },
  password: { type: String, required: false },
  gender: { type: String, enum: ['male', 'female', ''], default: '' },
  usertype: { type: String, enum: ['instructor', 'client', ''], default: '' },
  facebookId: { type: String },
  facebook: { type: Schema.Types.Mixed },
  googleId: { type: String },
  google: { type: Schema.Types.Mixed },
  instagramId: { type: String },
  instagram: { type: Schema.Types.Mixed },
  createToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model('users', schema);
