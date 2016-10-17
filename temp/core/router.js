/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React from 'react';
import { matchURI } from '~/utils/utils';
// Find the route matching the specified location (context), fetch the required data,
// instantiate and return a React component
function resolve(routes, context) {
  const path = decodeURI(context.pathname);
  for (const route of routes) {
    const params = matchURI(route, context.error ? '/error' : path);
    const comp = route.component.replace('./routes/', '');
    console.log(comp);
    console.log(params);
    let myprops = {};
    let MAPPING = [];
    let keys = [];
    let arraytodo;
    if (route.lang) {
      myprops.lang = route.lang;
    }
    if (route.description) {
      myprops.description = route.description;
    }
    if (route.keywords) {
      myprops.keywords = route.keywords;
    }
    if (route.title) {
      myprops.title = route.title;
    }
    if (route.h1) {
      myprops.h1 = route.h1;
    } else {
      myprops.h1 = "";
    }
    if (route.h2) {
      myprops.h2 = route.h2;
    } else {
      myprops.h2 = "";
    }
    if (params) {
      // Check if the route has any data requirements, for example:
      //
      //   {
      //     path: '/tasks/:id',
      //     data: { task: 'GET /api/tasks/$id' },
      /*  "data": {
       "articles": "GET https://gist.githubusercontent.com/koistya/a32919e847531320675764e7308b796a/raw/articles.json",
       "googleP": "GET http://picasaweb.google.com/data/entry/api/user/104140211971665971268?alt=json"
       }*/
      //     component: './routes/TaskDetails'
      //   }
      //
      if (route.data) {
        // Load route component and all required data in parallel
        keys = Object.keys(route.data);
        //return Promise.all([
        // route.load(),
        MAPPING = keys.map(key => {
          const query = route.data[key];
          const method = query.substring(0, query.indexOf(' ')); // GET
          const url = query.substr(query.indexOf(' ') + 1);      // /api/tasks/$id
          // TODO: Replace query parameters with actual values coming from `params`
          return fetch(url, { method }).then(resp => resp.json());
        });
      }
      arraytodo = [
        route.load(),
        route.loadmd(),
        ...MAPPING];
      return Promise.all(arraytodo).then(
        ([Component, data,...datamap]) => {
          let props, passparams;
          //console.log(data);
          if (keys)
            props = keys.reduce((result, key, i) => ({ ...result, [key]: datamap[i] }), {});
          else
            props = {};
          console.log(comp);
          if (comp === 'Map' && params.ie)
            passparams = { lat: params.id, long: params.ie };
          else if (comp === 'Map' && params.id)
            passparams = { nameMap: params.id };
          props = Object.assign({}, props, passparams);
          return (
            <window.LAYOUT
              comp={comp}
              {...passparams}
              title={(comp === 'Map' && params.ie) ? params.id + '/' + params.ie : params.id || myprops.h1}
              subtitle={myprops.h2 + ": " + (((comp === 'Map' && params.ie) ? params.id + '/' + params.ie : params.id) || '')}
            >
              <Component
                className="clearfix"
                route={route}
                error={context.error}
                {...data}
                {...props}
                {...myprops}
              />
            </window.LAYOUT>
          );
        }).catch((err) => {
        console.error(err);
      });
    }
  }
  const error = new Error('Page not found');
  error.status = 404;
  return Promise.reject(error);
}
export default { resolve };
