/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { disable } from 'feathers-hooks';
import createDefaultSeason from './createDefaultSeason';
export const before = {
  all: [],
  find: [
    createDefaultSeason(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
export const after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
