/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

export default function () {
  return function createClient(hook) {
    if (!hook.params.flagPreventAttach) {
      const promises = hook.result.map((client, index) => {
        const query = { uuid: client.uuid };
        console.log(query);
        hook.params.flagPreventAttach = true;
        return hook.app.service('users').find({ ...hook.params, query })
          .then(info => {
            if (info.length > 0)
              hook.result[index] = Object.assign({}, hook.result[index], info[0]);
            // hook.result[index].userInfo = info[0];
            return hook;
          })
          .catch(error => console.log(error));
      });
      return Promise.all(promises).then(() => hook);
    }
    return hook;
  };
}
