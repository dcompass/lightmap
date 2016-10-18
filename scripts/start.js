/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

//import runServer from './runServer';
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware');
const config_head = require(path.resolve(process.cwd(), './config/external.json'));
const tomerge = config_head.production.scripts
  .filter(name =>name.import)
  .map(sc => {
    return { [sc.identifier]: (sc.file ? (`${(sc.file.indexOf("http") > -1) ? sc.file : "/dist/" + config_head.dir.js + "/" + sc.file }`) : null) };
  }).reduce((prev, curr) => {
    var curr = Object.assign({}, prev, curr);
    return (prev, curr);
  });
module.exports = config => {
  let count = 0;
  return new Promise(resolve => {
    const bs = require('browser-sync').create();
    const compiler = webpack(config.webpack);
    const middlewarecross = function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    }
    if (!process.env.template) {
      const webpackMiddl = webpackDevMiddleware(compiler, {
        publicPath: config.webpack.output.publicPath,
        stats: config.webpack.stats,
      });
      compiler.plugin('done', stats => {
        // Generate index.html page
        // const manifest = stats.compilation.chunks.find(x => x.name === 'manifest').files[0];
        const styles = stats.compilation.chunks.find(x => x.name === 'main').files[1];
        const bundle = stats.compilation.chunks.find(x => x.name === 'main').files[0];
        const vendor = stats.compilation.chunks.find(x => x.name === 'vendor').files[0];
        const template = fs.readFileSync('./index.ejs', 'utf8');
        const render = ejs.compile(template, {
          filename: './index.ejs'
        });
        outputobj = {
          debug: process.env.NODE_ENV === 'development',
          //   tap: `/dist/${tap}`,
          bundle: `/dist/${bundle}`,
          vendor: `/dist/${vendor}`,
          styles: `/dist/${styles}`,
          config: config.webpack
        }
        /* const output = render({
         debug: process.env.NODE_ENV === 'development',
         manifest: `/dist/${manifest}`,
         bundle: `/dist/${bundle}`,
         vendor: `/dist/${vendor}`,
         config: config.webpack
         });*/
        var outputobj = Object.assign({}, outputobj, tomerge);
        const output = render(outputobj);
        fs.writeFileSync('./public/index.html', output, 'utf8');
        // Launch Browsersync after the initial bundling is complete
        // For more information visit https://browsersync.io/docs/options
        if (++count === 1) {
          bs.init({
            // host: "fr.skiscool.com",
            // port: process.env.PORT || 3000,
            // ui: { port: Number(process.env.PORT || 3000) + 1 },
            // server: {
            //   baseDir: 'public',
            open: false,
            host: 'fr.skiscooldev.com',
            socket: {
              domain: 'fr.skiscooldev.com'
            },
            /*https: {
             key: "/usr/local/etc/openssl/private/apache-selfsigned.key",
             cert: "/usr/local/etc/openssl/certs/apache-selfsigned.pem"
             },*/
            proxy: {
              target: 'https://localhost:3000',
              ws: true,
              middleware: [
                webpackMiddl,
                require('webpack-hot-middleware')(compiler),
                require('connect-history-api-fallback')(),
              ],
            },
            snippetOptions: {
              ignorePaths: ['tiles/*', 'tiles/**/*']
            },
          }, resolve);
        }
      });
    } else {
      // Node.js middleware that compiles application in watch mode with HMR support
      // http://webpack.github.io/docs/webpack-dev-middleware.html
      const publicPath = config.webpack[0].output.publicPath
      const webpackMiddl = webpackMiddleware(compiler, {
        publicPath: publicPath,
        stats: config.webpack[0].stats,
      });
      compiler.plugin('done', stats => {
        const bundle = stats.stats[0].compilation.chunks.find(x => x.name === 'main').files[0];
        const bundleserver = stats.stats[1].compilation.chunks.find(x => x.name === 'main').files[0];
        console.log(bundle)
        // Launch Browsersync after the initial bundling is complete
        // For more information visit https://browsersync.io/docs/options
        if (++count === 1) {
          const startbs = (err) => {
            if (!err) {
              bs.init({
                proxy: {
                  target: 'localhost:3000',
                  // baseDir: 'public',
                  middleware: [
                    middlewarecross,
                    webpackMiddl,
                    require('webpack-hot-middleware')(compiler),
                    //require('connect-history-api-fallback')(),
                  ],
                },
                snippetOptions: {
                  ignorePaths: ['tiles/**'],
                },
                files: ['public/dist/*.*']
              }, resolve);
              //todo browser-sync
            }
          };
          runServer(startbs);
        }
      });
    }
  });
};
