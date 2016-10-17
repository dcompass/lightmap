/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

const toRegExp = require('path-to-regexp');
const fs = require('fs');
const Bluebird = require('bluebird');
global.Promise = Bluebird;
function escape(text) {
  return text.replace('\'', '\\\'').replace('\\', '\\\\');
}
const promisifiedopen = Promise.promisify(fs.open);
const promisifiedreaddir = Promise.promisify(fs.readdir);
/**
 * Converts application routes from JSON to JavaScript. For example, a route like
 *
 *   {
 *     "path": "/about",
 *     "component": "./routes/About"
 *   }
 *
 * becomes
 *
 *   {
 *     path: '/about',
 *     pattern: /^\\/about(?:\/(?=$))?$/i,
 *     keys: [],
 *     component: './routes/About',
 *     load: function () { return new Promise(resolve => require(['./routes/About'], resolve)); }
 *   }
 */

module.exports = function routesLoader(source) {
  this.cacheable();
  const callback = this.async();
  const Myrequiremd_def = (module, name) => `new Promise(function (resolve, reject) {
        try {
          require.ensure(['${escape(module)}'], ()=> {
            resolve(require('${escape(module)}').default);
          },'${escape(name)}')
        } catch (err) {
        console.log(err)
          reject(err);
        }
      })`;
  const Myrequiremd = (module, name) => `new Promise(function (resolve, reject) {
        try {
          require.ensure(['${escape(module)}'], ()=> {
            resolve(require('${escape(module)}'));
          },'${escape(name)}')
        } catch (err) {
        console.log(err)
          reject(err);
        }
      })`;
  let outputP = [];
  const routes = JSON.parse(source);
  const Myrequiredef = module => `Promise.resolve(require('${escape(module)}').default)`;
  const Myrequire = module => `Promise.resolve(require('${escape(module)}'))`;
  const GetFileout = (appRoot, path, route, resuser) => {
    const keys = [];
    let myouta;
    const pattern = toRegExp(route.path, keys);
    let mdfile_r, mdfile;
    mdfile_r = route.component.replace('./routes/', '');
    return promisifiedreaddir(appRoot + path).then(function (fullfill) {
      let fk, addl, result;
      if (route.lang === 'en')
        addl = true;
      else
        addl = false;
      result = fullfill.reduce((res, file) => {
        if ((file.indexOf('.md') !== -1) && ((addl && file.indexOf('_') === -1) || (file.indexOf(`_${route.lang}`) !== -1))) {
          if (process.env.NODE_ENV === 'development')
            res += `${Myrequire(route.component + '/' + file)};`
          else
            res += `${Myrequiremd(route.component + '/' + file, route.lang, '')};`
          return res;
        } else {
          return res;
        }
      }, '');
      return result;
    }, function (reject) {
      console.log('whyrejected?');
      return false;
      // output.push(` return {html:'file ${escape(mdfile_r)} not found'}; \n`)
    }).then(function (res) {
      if (res === '')
        res = `Promise.resolve({html:'file lang  ${escape(mdfile_r)} on ${route.lang} not found'});`;
      console.log(res);
      let out = [];
      out.push('  {\n');
      out.push(`    path: '${escape(route.path)}',\n`);
      out.push(`    pattern: ${pattern.toString()},\n`);
      out.push(`    keys: ${JSON.stringify(keys)},\n`);
      out.push(`    component: '${escape(route.component)}',\n`);
      if (route.data) {
        out.push(`    data: ${JSON.stringify(route.data)},\n`);
      }
      if (route.keywords) {
        out.push(`    keywords: ${JSON.stringify(route.keywords)},\n`);
      }
      if (route.description) {
        out.push(`    description: ${JSON.stringify(route.description)},\n`);
      }
      if (route.title) {
        out.push(`    title: ${JSON.stringify(route.title)},\n`);
      }
      if (route.h1) {
        out.push(`    h1: ${JSON.stringify(route.h1)},\n`);
      } else {
        out.push(`    h1: ${JSON.stringify(route.title)},\n`);
      }
      if (route.h2) {
        out.push(`    h2: ${JSON.stringify(route.h2)},\n`);
      } else {
        out.push(`    h2: ${JSON.stringify('')},\n`);
      }
      if (route.lang) {
        out.push(`    lang: ${JSON.stringify(route.lang)},\n`);
      }
      if (route.chunk && (process.env.NODE_ENV !== "development"))
        out.push(`    load() {\n      return ${Myrequiremd_def(route.component + '/' + mdfile_r, route.chunk)};\n    },\n`);
      else
        out.push(`    load() {\n      return ${Myrequiredef(route.component + '/' + mdfile_r)};\n    },\n`);
      out.push(`    loadmd() { \n`);
      out.push(` 		return ${res}  \n`);
      out.push(`    },\n`);
      if (route.checkid && resuser) {
        out.push(`    outpromise(i) { console.log('runningwith:' + i);\n`);
        out.push(`    let obj=${resuser};  \n`);
        out.push(`     return (obj)?obj[i]:false;  \n`);
        out.push(`    },\n`);
      }
      out.push('    },\n');
      return out;
    });
  }
  routes.forEach(function (route, i) {
    let appRoot = process.cwd(), path = route.component.replace('./', '/');
    let resuser = false;
    let myout, getin;
    if (route.checkid) {
      myout = promisifiedreaddir(appRoot + path + '/' + route.checkid).then(function (fullfill) {
        let fk, addl, result;
        getin = 0;
        if (route.lang === 'en')
          addl = true;
        else
          addl = false;
        console.log(route.lang);
        result = fullfill.reduce((res, file) => {
          if ((addl && file.indexOf('_') === -1) || (file.indexOf(`_${route.lang}`) !== -1)) {
            fk = file.substr(0, file.length - 3);
            getin++;
            if (process.env.NODE_ENV === 'development')
              res += `${fk}:${Myrequire(route.component + '/' + route.checkid + '/' + file)},`
            else
              res += `${fk}:${Myrequiremd(route.component + '/' + route.checkid + '/' + file, route.lang)},`
            return res;
          } else {
            return res;
          }
        }, '{');
        return result;
      }, function (reject) {
        return '{';
      }).then(function (resuserp) {
        //console.log(getin);
        resuserp = (getin) ? resuserp.substr(0, resuserp.length - 1) + '}' : resuserp + '}';
        //console.log(resuserp);
        return GetFileout(appRoot, path, route, resuserp);
      });
    } else {
      myout = GetFileout(appRoot, path, route, resuser);
    }
    outputP.push(myout);
  });
  const outputfinal = ['[\n'];
  Promise.all(outputP).then((values) => {
    values.forEach(function (value, i) {
      value.forEach(function (val, i) {
        outputfinal.push(val);
      });
    });
    return outputfinal;
  }, function (oo) {
    console.log('err');
    console.log(oo);
    callback(oo);
  }).then((output) => {
    output.push(']');
    let result = output.join('');
    callback(null, `module.exports = ${result}`);
    //return output.join('');
  });
}
