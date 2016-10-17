/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

export default function () {
  return function attachBoundaryRect(hook) {
    if (hook.params.provider) {
      const promises = hook.result.map((boundary, index) => {
        const query = { boundaryId: boundary.uuid };
        return hook.app.service('boundaryRects').find({ query })
          .then((results) => {
            hook.result[index].boundaryRects = results;
            return hook;
          });
      });
      return Promise.all(promises)
        .then(() => hook);
    }
    return hook;
  };
}
