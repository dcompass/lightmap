/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import mongoose from 'mongoose';
import feathers, { static as serverStatic } from 'feathers';
import compress from 'compression';
import configuration from 'feathers-configuration';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest';
import bodyParser from 'body-parser';
import socketio from 'feathers-socketio';
import path from 'path';
import dotenv from 'dotenv';
import middleware from './middleware';
import services from './newservice';
import verifyTokenHandler from './newservice/users/verifyTokenHandler';
dotenv.config();
const app = feathers();
const middlewarecross = function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}
function connectDatabase({ host, port, name }) {
  const uri = `mongodb://${host}:${port}/${name}`;
  mongoose.Promise = global.Promise;
  const options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
  };
  return mongoose.connect(uri, options);
}
const options = {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['htm', 'html'],
  index: 'index.html',
  lastModified: true,
  maxAge: '1d',
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
    res.header('Cache-Control', 'public, max-age=1d');
  }
};
app.configure(configuration(path.join(__dirname, '..')))
  .use(compress())
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  .configure(verifyTokenHandler)
  .use(bodyParser.json())
  .use(middlewarecross)
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(services)
  .use('/', serverStatic(app.get('public'), options)).use('*', serverStatic(app.get('public'), options))
app.configure(middleware);
connectDatabase(app.get('server').db);
app.on('login', (data) => console.log('User logged in', data));
app.on('logout', (data) => console.log('User logged out', data));
app.get('/hello', (req, res) => {
  console.log('/hello',
    '\n  req.feathers:', req.feathers,
    '\n  req.params:', req.params,
    '\n  req.user:', req.user);
  res.send(req.isAuthenticated() ? 'authenticated' : 'NOT authenticated');
});
module.exports = app;
