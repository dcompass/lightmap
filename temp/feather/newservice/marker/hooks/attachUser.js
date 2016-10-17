/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
/**
 * Created by BaeBae on 9/18/16.
 */

export default function () {
  return function attachUser(hook) {
    if (hook.params.provider) {
      const promises = hook.result.map((marker, index) => {
        const query = { uuid: marker.createdAt };
        return hook.app.service('users').find({ query })
          .then(info => {
            hook.result[index].createdBy = info[0];
            return hook;
          })
          .catch(error => console.log(error));
      });
      return Promise.all(promises).then(() => hook);
    }
    return hook;
  };
}
