/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

export default {
  model: 'post',
  namespace: '/post',
  options: {
    id: 'uuid',
    paginate: {
      default: 25,
      max: 50,
    },
  },
};
