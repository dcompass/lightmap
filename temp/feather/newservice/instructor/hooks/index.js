/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { disable } from 'feathers-hooks';
import { hooks as auth } from 'feathers-authentication';
import attachUser from './attachUser';
export const before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.verifyToken()
  ],
  update: [
    auth.verifyToken()
  ],
  patch: [
    auth.verifyToken()
  ],
  remove: [],
};
export const after = {
  all: [],
  find: [
    attachUser(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
