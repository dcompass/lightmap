/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
/**
 * Created by BaeBae on 9/12/16.
 */
export default function verifyTokenHandler() {
  const app = this;
  app.get('/verifyToken', (req, res, next) => {
    console.info('verify token', req.query);
    if (req.query.token) {
      const createToken = /token=(.*)/g.exec(req.url)[1];
      if (!createToken) {
        throw new Error('No token provided.');
      }
      return app.service('users').find({ query: { createToken } })
        .then((user) => {
          console.info('user', user);
          return Promise.all([
            app.service('users').patch(
              user[0]._id,
              { createToken: null }
            ),
          ]);
        })
        .then(() => res.redirect(`http://${app.get('host')}:${app.get('port')}`))
        .catch(err => console.log(err));
    }
    next();
  });
}
