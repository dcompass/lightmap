/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
/**
 * Created by BaeBae on 9/14/16.
 */

export default function () {
  return function createInstructor(hook) {
    if (!hook.params.flagPreventAttach) {
      const promises = hook.result.map((instructor, index) => {
        const query = { uuid: instructor.uuid };
        hook.params.flagPreventAttach = true;
        return hook.app.service('users').find({ ...hook.params, query })
          .then(info => {
            delete info[0]._id;
            if (info.length > 0)
              hook.result[index] = Object.assign({}, info[0], hook.result[index]);
            return hook;
          })
          .catch(error => console.log(error));
      });
      return Promise.all(promises).then(() => hook);
    }
    return hook;
  };
}
