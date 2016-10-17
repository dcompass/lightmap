/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import service from 'feathers-mongoose';
import model from './model';
import { before, after } from './hooks';
export default function init() {
  const app = this;
  app.use('/instructors', service({
    Model: model,
    lean: true,
  }));
  app.service('instructors').before(before).after(after);
}
