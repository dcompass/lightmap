/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import fs from 'fs';
import authentication from 'feathers-authentication';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as InstagramStrategy } from 'passport-instagram';
import InstagramTokenStrategy from 'passport-instagram-token';
function getServices() {
  return fs.readdirSync(__dirname);
}
function loadServices(app) {
  getServices(app).forEach(service => {
    if (/^[a-z0-9-]+$/i.test(service)) {
      app.configure(require(`${__dirname}/${service}`).default);
    }
  });
}
/*
 function initAuth(app) {
 const config = app.get('auth');
 
 const token = authentication.TokenService;
 const local = authentication.LocalService;
 const oauth2 = authentication.OAuth2Service;
 
 const facebookProvider = Object.assign({
 provider: 'facebook',
 strategy: FacebookStrategy,
 tokenStrategy: FacebookTokenStrategy,
 }, config.facebook);
 const facebook = Object.assign({}, facebookProvider);
 
 const instagramProvider = Object.assign({
 provider: 'instagram',
 strategy: InstagramStrategy,
 tokenStrategy: InstagramTokenStrategy,
 }, config.instagram);
 const instagram = Object.assign({}, instagramProvider);
 
 app.configure(authentication({ cookies: { enable: true } }))
 .configure(token())
 .configure(local())
 .configure(oauth2(instagram))
 .configure(oauth2(facebook));
 }*/
function initAuth(app) {
  const config = app.get('auth');
  config.facebook.strategy = FacebookStrategy;
  config.facebook.tokenStrategy = FacebookTokenStrategy;
  config.instagram.strategy = InstagramStrategy;
  config.instagram.tokenStrategy = InstagramTokenStrategy;
  app.set('auth', config);
  app.configure(authentication(config));
}
export default function init() {
  const app = this;
  initAuth(app);
  loadServices(app);
}
