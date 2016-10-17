/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { disable, remove } from 'feathers-hooks';
import { hooks as auth } from 'feathers-authentication';
import { setUUID } from '../../../hooks/setUUID';
import sendEmail from './sendEmail';
import createInstructor from './createInstructor';
import createUser from './createUser';
import attachClientInformation from './attachClientInformation';
import attachInstructorInformation from './attachInstructorInformation';
import checkEmailVerification from './checkEmailVerification';
export const before = {
  all: [],
  find: [],
  get: [],
  create: [
    setUUID(),
    auth.populateUser(),
    sendEmail(),
    auth.hashPassword(),
    remove('fake', 'price', 'category', 'languages', 'resorts', 'background', 'rate', (hook) => {
      hook._data = Object.assign({}, hook.data);
      return true;
    }),
  ],
  update: [
    auth.verifyToken(),
    auth.hashPassword(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner(),
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    remove('fake', (hook) => {
      hook._data = Object.assign({}, hook.data);
      return true;
    }),
  ],
  remove: [
    disable(),
  ],
};
export const after = {
  all: [
    remove('password'),
  ],
  find: [
    checkEmailVerification(),
    attachClientInformation(),
    attachInstructorInformation(),
  ],
  get: [
    attachClientInformation(),
    attachInstructorInformation(),
  ],
  create: [
    createInstructor(),
    createUser(),
  ],
  update: [
    createInstructor(),
    createUser(),
  ],
  patch: [
    createInstructor(),
    createUser(),
  ],
  remove: [],
};
