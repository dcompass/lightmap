/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import hooks from 'feathers-hooks';
export default function (field, options) {
  const myPopulate = hooks.populate(field, options);
  return (hook) => {
    if (hook.params.provider || !!hook.params.populate) {
      return myPopulate(hook);
    }
    return hook;
  };
}
