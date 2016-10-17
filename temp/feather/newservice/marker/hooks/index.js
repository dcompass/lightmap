/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import attachUser from './attachUser';
import ifnotexistcreate from './ifnotexistcreate';
export const before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.hooks.verifyToken(),
    auth.hooks.associateCurrentUser({ as: 'createdBy' }),
  ],
  update: [
    ifnotexistcreate(),
    auth.hooks.restrictToOwner(),
  ],
  patch: [
    ifnotexistcreate(),
    auth.hooks.verifyToken(),
    auth.hooks.associateCurrentUser({ as: 'createdBy' }),
  ],
  remove: [
    auth.hooks.verifyToken(),
  ],
};
export const after = {
  all: [],
  find: [
    attachUser(),
  ],
  get: [
    attachUser(),
  ],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
