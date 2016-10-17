/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

export default function () {
  return function checkEmailVerification(hook) {
    hook.result.map((user, index) => {
      if (user.createToken && user.createToken.length > 0) {
        hook.result[index].verified = false;
      }
    });
    return hook;
  };
}
