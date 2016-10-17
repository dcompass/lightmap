/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
const fs = require('fs');
const ejs = require('ejs');
const webpack = require('webpack');
const path = require('path');
const config_head = require(path.resolve(process.cwd(), './config/external.json'));
const tomerge = config_head.production.scripts
  .filter(name =>name.import)
  .map(sc => {
    return { [sc.identifier]: (sc.file ? (`${(sc.file.indexOf("http") > -1) ? sc.file : "/dist/" + config_head.dir.js + "/" + sc.file }`) : null) };
  }).reduce((prev, curr) => {
    var curr = Object.assign({}, prev, curr);
    return (prev, curr);
  });
module.exports = config => new Promise((resolve, reject) => {
  webpack(config.webpack).run((err, stats) => {
    if (err) {
      reject(err);
    } else {
      console.log(stats.toString(config.webpack.stats));
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
        //   manifest: `/dist/${manifest}`,
        bundle: `/dist/${bundle}`,
        vendor: `/dist/${vendor}`,
        styles: `/dist/${styles}`,
        config: config.webpack
      }
      var outputobj = Object.assign({}, outputobj, tomerge);
      console.log(outputobj);
      const output = render(outputobj);
      fs.writeFileSync('./public/index.html', output, 'utf8');
      resolve();
    }
  });
});
