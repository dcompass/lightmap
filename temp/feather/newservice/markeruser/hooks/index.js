/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { disable } from 'feathers-hooks';
import auth from 'feathers-authentication';
import attachUser from './attachUser';
import updateUserMarker from './updateUserMarker';
export const before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.hooks.verifyToken(),
    auth.hooks.associateCurrentUser({ as: 'createdBy' }),
  ],
  update: [
    auth.hooks.restrictToOwner(),
  ],
  patch: [
    auth.hooks.verifyToken(),
    auth.hooks.associateCurrentUser({ as: 'createdBy' }),
    updateUserMarker(),
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
