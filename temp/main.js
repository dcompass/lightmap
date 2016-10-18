/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { readState, saveState } from 'history/lib/DOMStateStorage';
import { Provider } from 'mobx-react';
import { MatchMediaProvider } from 'mobx-react-matchmedia';
import App from './components/App/App';
import Layout from './components/Layout';
import {
  addEventListener,
  removeEventListener,
  windowScrollX,
  windowScrollY,
} from './core/DOMUtils';
import router from './core/router';
import history from './core/history';
// import FastClick from 'fastclick';
import $store from './store/stores'; // initialize stores
import dicoarray_func from './get-dico_chunk';
String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
};
window.__routesfr__ = require('./routes.json');
window.LAYOUT = Layout;
/*
 import { app } from '~/shared/app';
 /socket use and working!
 currentlocation={lat:0,lont:0};
 app().io.on('connect',function(){
 // Send ehlo event right after connect:
 //app().io.emit('setlocation',currentlocation);
 app().io.emit('location','name',function(data){

 })
 */
let oldhost = window.location.hostname;
let routes;
function checkhostnamechange(oh) {
  const data = window.location.hostname;
  oldhost = window.location.hostname;
  if (data !== oh) {
    console.log('hostchanging:' + process.env.SITE);
    if (data === process.env.SITE) {
      routes = window.__routesfr__;
      window.__lang__ = 'fr';
    }
    window.__routes__ = routes;
  }
}
checkhostnamechange('');
const MOUNT_NODE = document.getElementById('root');
let currentLocation, currentLang;
const context = {
  muiTheme: {},
  setTitle: value => (document.title = value),
  setMeta: (name, content) => {
    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    const elements = document.getElementsByTagName('meta');
    Array.from(elements).forEach((element) => {
      if (element.getAttribute('name') === name) {
        element.parentNode.removeChild(element);
      }
    });
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document
      .getElementsByTagName('head')[0]
      .appendChild(meta);
  },
};
const initialState = {
  app: {},
  ui: { theme: { mui: {} } }
};
const store = $store.set(initialState);
window.__STORE = store;
function restoreScrollPosition(state) {
  if (state && state.scrollY !== undefined) {
    window.scrollTo(state.scrollX, state.scrollY);
  } else {
    window.scrollTo(0, 0);
  }
}
const renderComplete = (s) => {
  restoreScrollPosition(s);
  // Google Analytics tracking. Don't send 'pageview' event after
  // the initial rendering, as it was already sent
  if (window.ga) {
    window.ga('send', 'pageview');
  }
};
function renderComponent(component) {
  const breakpoints = store.ui.breakpoints;
  ReactDOM.render(
    <Provider context={context} appstate={store}>
        <MatchMediaProvider breakpoints={breakpoints}>
          <div>
            <App children={component}/>
          </div>
        </MatchMediaProvider>
    </Provider>,
    MOUNT_NODE, () => {
      // document.title = result.title || '';
      renderComplete(currentLocation.state);
    }
  )
  ;
}
function resolveroute(routes, location, force) {
  router.resolve(routes, location)
    .then(renderComponent)
    .catch(error => {
      console.log(error);
      router.resolve(routes, { ...location, error }).then(renderComponent);
    });
}
// Make taps on links and buttons work fast on mobiles
//  FastClick.attach(document.body);
// Find and render a web page matching the current URL path,
// if such page is not found then render an error page (see routes.json, core/router.js)
function render(location, force) {
  if (currentLocation.key) {
    saveState(currentLocation.key, {
      ...readState(currentLocation.key),
      scrollX: windowScrollX(),
      scrollY: windowScrollY(),
    });
  }
  // currentLocation = location;
  if (/auth.*/.test(location.pathname)) {
// renderComponent(<login/>);
  } else {
    if (force || (location.pathname !== currentLocation.pathname)) {
      console.log('render');
      currentLocation = location;
      if (force || (currentLang !== window.__lang__)) {
        dicoarray_func[window.__lang__]().then(([dico,dico1]) => {
          global.dico = Object.assign({}, dico, dico1);
          resolveroute(window.__routes__, location, force);
        });
        currentLang = window.__lang__;
      }
      else {
        resolveroute(window.__routes__, location, force);
      }
    }
  }
  // currentLocation = location.pathname;
}
function createApp(hist) {
  currentLocation = hist.getCurrentLocation();
  currentLocation.pathname = 'init';
  //injectTapEventPlugin();
  const removeHistoryListener = history.listen(render);
  history.replace(history.getCurrentLocation());
  let originalScrollRestoration;
  if (window.history && 'scrollRestoration' in window.history) {
    originalScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
  }
  // Prevent listeners collisions during history navigation
  addEventListener(window, 'pagehide', function onPageHide() {
    removeEventListener(window, 'pagehide', onPageHide);
    removeHistoryListener();
    if (originalScrollRestoration) {
      window.history.scrollRestoration = originalScrollRestoration;
      originalScrollRestoration = undefined;
    }
  });
}
/*
 if ([   'complete',
 'loaded',
 'interactive'
 ].includes(document.readyState) && document.body) {
 createApp.bind(null, history)
 } else {
 document.addEventListener('DOMContentLoaded', createApp.bind(null, history), false);
 }*/

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/ReactJSTraining/history/tree/master/docs#readme
createApp(history);
