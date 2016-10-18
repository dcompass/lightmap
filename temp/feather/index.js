/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import app from './app';
import https from 'https';
import fs from 'fs';
import path from 'path';
function logServerConfig(type = null) {
  const port = type === 'API' ? process.env.API_PORT : process.env.WEB_PORT;
  const host = type === 'API' ? process.env.API_HOST : process.env.WEB_HOST;
  const url = `https://${host}:${port}`;
  if (type === 'API') {
    this.logger.info('------------------------------------------');
    this.logger.info('API Listening at:', url);
    this.logger.info('------------------------------------------');
    this.logger.info('Database Host:', app.get('server').db.host);
    this.logger.info('Database Name:', app.get('server').db.name);
    this.logger.info('Database Port:', app.get('server').db.port);
    this.logger.info('------------------------------------------');
  }
  if (type !== 'API') {
    this.logger.info('WEB Listening at:', url);
    this.logger.info('Environment:', process.env.NODE_ENV);
    this.logger.info('------------------------------------------');
    this.logger.info('IO Host:', process.env.IO_HOST);
    this.logger.info('IO Port:', process.env.IO_PORT);
    this.logger.info('------------------------------------------');
  }
}
let pathkey, pathcert;
if (process.env.NODE_ENV === "development") {
  pathkey = path.join(__dirname, 'resources', 'apache-selfsigned.key');
  pathcert = path.join(__dirname, 'resources', 'apache-selfsigned.pem');
} else {
  pathkey = '/etc/letsencrypt/live/fr.skiscool.com/privkey.pem';
  pathcert = '/etc/letsencrypt/live/fr.skiscool.com/fullchain.pem';
}

const httpsServer = https.createServer({
  key: fs.readFileSync(pathkey),
  cert: fs.readFileSync(pathcert),
  rejectUnauthorized: false,
  requestCert: false
}, app).listen(process.env.API_PORT);
app.setup(httpsServer);
httpsServer.on('listening', logServerConfig.bind(app, 'API'));
