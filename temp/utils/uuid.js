/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
/**
 * Created by BaeBae on 9/5/16.
 */
export const generateUUID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

