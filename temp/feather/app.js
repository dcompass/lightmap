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
import async from 'async';
import middleware from './middleware';
import services from './newservice';

import verifyTokenHandler from './newservice/users/verifyTokenHandler';
dotenv.config();
if (!process.env.NODE_ENV)
  process.env.NODE_ENV = "development";
else
  process.env.NODE_ENV = "production"

const app = feathers();
function connectDatabase({ host, port, name }) {
  const uri = `mongodb://${host}:${port}/${name}`;
  mongoose.Promise = global.Promise;
  const options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
  };
  return mongoose.connect(uri, options);
}
function parallel(middlewares) {
  return function (req, res, next) {
    async.each(middlewares, function (mw, cb) {
      mw(req, res, cb);
    }, next);
  };
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
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  .configure(verifyTokenHandler);
app.use(parallel([
  compress(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
]))
  .use(serverStatic(app.get('public'), options))
  .use('*', serverStatic(app.get('public'), options))
  .configure(services)
  .configure(middleware);
/*
 app.configure(configuration(path.join(__dirname, '..')))
 .configure(rest())
 .configure(socketio())
 .configure(hooks())
 .configure(verifyTokenHandler)*/

/*
 .use(compress())
 .use(bodyParser.json())
 .use(middlewarecross)
 .use(bodyParser.urlencoded({ extended: true }))*/

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
