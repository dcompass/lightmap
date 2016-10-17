/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

const getdicofr = () => {
  return Promise.all([new Promise(resolve => {
    require.ensure(['./dico-fr.js'], () => {
      resolve(require('./dico-fr.js'));
    }, `${(process.env.NODE_ENV == 'development') ? "main" : "dicofr"}`);
  }),
                      new Promise(resolve => {
                        require.ensure(['./Skiscool-dico-fr.js'], () => {
                          resolve(require('./Skiscool-dico-fr.js'));
                        }, `${(process.env.NODE_ENV == 'development') ? "main" : "dicofr"}`);
                      })
  ]);
};
const dicoarray_func = {
  fr: getdicofr
}
export default dicoarray_func;
