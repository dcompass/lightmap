/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { disable } from 'feathers-hooks';
import { setUUID } from '../../../hooks/setUUID';
import createhook from './createhook';
import reinitboundcenter from './reinitboundcenter';
export const before = {
  all: [],
  find: [],
  get: [],
  create: [
    createhook(),
    setUUID(),
  ],
  update: [],
  patch: [],
  remove: [],
};
export const after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [
    reinitboundcenter()],
  patch: [
    reinitboundcenter()],
  remove: [
    reinitboundcenter()],
};
