/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
/**
 * Created by BaeBae on 9/18/16.
 */

export default function () {
  return function ifnotexistcreate(hook) {
    if (hook.params.provider) {
      const query = { uuid: hook.data.uuid };
      return hook.app.service('markers').find({ query })
        .then((results) => {
          if (results.length == 0) {
            let query = { ...hook.data, createdBy: 'none' };
            console.log(query);
            hook.app.service('markers').create(query)
              .then((a)=>console.info('created')).catch((err) => {
              console.info('service ifnotexistcreate error', err);
            });
          }
        });
    }
    return hook;
  };
}
