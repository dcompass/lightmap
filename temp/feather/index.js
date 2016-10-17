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
    this.logger.info('Database Host:', process.env.DB_HOST);
    this.logger.info('Database Name:', process.env.DB_NAME);
    this.logger.info('Database Port:', process.env.DB_PORT);
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
//const server = app.listen(process.env.API_PORT);
//server.on('listening', logServerConfig.bind(app, 'API'));
const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'resources', 'apache-selfsigned.key')),
  cert: fs.readFileSync(path.join(__dirname, 'resources', 'apache-selfsigned.pem')),
  rejectUnauthorized: false,
  requestCert: false
}, app).listen(process.env.API_PORT);
app.setup(httpsServer);
httpsServer.on('listening', logServerConfig.bind(app, 'API'));
