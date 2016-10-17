/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import createDefaultBoundaries from './createDefaultBoundaries';
import attachBoundaryRect from './attachBoundaryRect';
import centertoLeaflet from './centertoLeaflet';
import { setUUID } from '../../../hooks/setUUID';
export const before = {
  all: [],
  find: [
    createDefaultBoundaries(),
  ],
  get: [],
  create: [
    auth.hooks.verifyToken(),
    //auth.hooks.populateUser(),
    setUUID(),
  ],
  update: [],
  patch: [],
  remove: [],
};
export const after = {
  all: [],
  find: [
    attachBoundaryRect(),
    centertoLeaflet(),
    //calculateCenter(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
