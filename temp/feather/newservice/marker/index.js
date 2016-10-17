/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import service from 'feathers-mongoose';
import model from './model';
import { before, after } from './hooks';
export default function init() {
  const app = this;
  app.use('/markers', service({
    Model: model,
    lean: true,
  }));
  // setup hooks
  app.service('markers').before(before).after(after);
}
