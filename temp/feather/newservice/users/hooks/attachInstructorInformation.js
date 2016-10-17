/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

export default function () {
  return function attachInstructorInformation(hook) {
    if ((!hook.params.flagPreventAttach)) {
      const promises = hook.result.map((user, index) => {
        if (user.usertype === 'instructor') {
          const query = { uuid: user.uuid };
          hook.params.flagPreventAttach = true;
          return hook.app.service('instructors').find({ ...hook.params, query })
            .then(info => {
              if (info && info.length > 0) {
                delete info[0]._id;
                hook.result[index] = Object.assign({}, info[0], hook.result[index]);
                if (!hook.result[index].username) {
                  hook.result[index].username = user.username;
                }
                if (!hook.result[index].email) {
                  hook.result[index].email = user.email;
                }
              }
              return hook;
            })
            .catch(error => console.log(error));
        }
        return hook;
      });
      return Promise.all(promises).then(() => hook);
    }
    return hook;
  };
}



