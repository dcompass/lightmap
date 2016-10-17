/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import service from 'feathers-mongoose';
import model from './model';
import { before, after } from './hooks';
export default function init() {
  const app = this;
  app.use('/boundaryRects', service({
    Model: model,
    lean: true,
  }));
  // setup hooks
  app.service('boundaryRects').before(before).after(after);
}
