/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import authentication from 'feathers-authentication/client';
const io = require('socket.io-client');
const socketio = require('feathers-socketio/client');
// const localstorage = require('localstorage-memory');
//* */ import rest from 'feathers-rest/client';
let instance = false;
const storage = (process.env.BROWSER) ? window.localStorage : null;
// console.log(`http://${process.env.API_HOST}:${process.env.API_PORT}`);
//* */ const uri = `http://${process.env.API_HOST}:${process.env.API_PORT}`;
//(process.env.HOSTIMG)
const host = 'https://dev.skiscooldev.com';
const socket = io(host, {
  secure: true,
  port: 3000,
  rejectUnauthorized: false
});
export function app() {
  if (instance) return instance;
  instance = feathers()
    .configure(socketio(socket, { timeout: 3000000 }))
    .configure(hooks())
    .configure(authentication({ storage, cookies: { enable: true } }));
  // .configure(rest('http://fr.skiscool.com').fetch(fetch))
  /* .configure(feathersAuth({ storage,{cookies: {enable:true}}
   tokenKey: 'token',
   cookie: 'token'
   }))*/
  return instance;
}
export function service(name) {
  return app().service(name);
}
