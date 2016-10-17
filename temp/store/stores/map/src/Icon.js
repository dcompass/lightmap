import L from 'mapbox.js';
import React from 'react';
const mapPin = 'M16,1 C7.7146,1 1,7.65636364 1,15.8648485 C1,24.0760606 16,51 16,51 C16,51 31,24.0760606 31,15.8648485 C31,7.65636364 24.2815,1 16,1 L16,1 Z'
const Skis = (positionClass) => {
  return `<svg width="40px" height="40px" class='${positionClass}' viewBox="0 0 90 90" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g id="ski">
        <path d="m 82.446884,44.270767 c -2.020008,-0.0096 -3.72389,1.499644 -3.820322,3.364296 -0.148754,2.88889 -2.813409,5.227745 -5.930189,5.22409 L 59.543142,52.819839 C 60.469156,32.905941 41.623573,27.675075 54.918999,22.677065 60.520412,19.425745 45.435446,17.845776 41.163875,31.707931 L 13.062059,21.214135 14.687368,17.587647 c 0.4618,-1.348129 1.250431,-2.872952 -0.189782,-3.240104 -1.438554,-0.367593 -2.9778,0.42834 -3.437942,1.776032 L 10.223467,18.566434 6.744079,17.68061 c -1.4372969,-0.369542 -2.9794594,0.42878 -3.4425162,1.778865 -0.4601402,1.347689 0.3332656,2.738829 1.7722206,3.107933 l 3.4756704,0.885183 -0.8332612,2.440468 c -0.4613978,1.349644 0.3303492,2.741219 1.7689032,3.108809 0.49824,0.12623 1.0063562,0.115246 1.4757422,-0.0088 0.897291,-0.237116 0.08251,-0.09346 0.384736,-0.977745 l 0.967911,-2.838053 29.674643,12.386501 c 0.41898,8.724117 18.834947,19.587793 -20.973492,15.143471 -2.009659,-0.01074 -3.722633,1.497687 -3.818665,3.363858 -0.09603,1.866168 1.458768,3.378887 3.472202,3.383745 l 51.685452,0.152525 c 1.259261,0.0046 2.486876,-0.157516 3.656186,-0.466476 5.453474,-1.440868 9.632829,-6.038562 9.913794,-11.482734 0.08779,-1.863978 -1.464947,-3.38212 -3.476722,-3.387419 z"/>
       </g></path></svg>`;
}
const Snowboards = (positionClass) => {
  return `<svg width="30px" height="30px" class='${positionClass}' viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g id="Snowboard">
          <path d="M60.821,5.149c-0.65-0.656-1.312-1.319-1.967-1.974c-2.142-2.142-5.101-3.298-8.139-3.165c-3.03,0.131-5.886,1.537-7.834,3.854C30.981,17.9,17.856,31.031,3.876,42.89c-2.32,1.949-3.727,4.804-3.858,7.832c-0.131,3.028,1.023,5.993,3.158,8.127c0.647,0.661,1.309,1.323,1.961,1.976C7.169,62.854,9.948,64,12.812,64c0.123,0,0.246-0.003,0.368-0.006c2.993-0.103,5.838-1.457,7.805-3.712c12.162-13.855,25.382-27.076,39.293-39.295c2.255-1.968,3.607-4.812,3.708-7.801C64.09,10.194,62.934,7.264,60.821,5.149z M19.479,58.964c-1.606,1.842-3.927,2.946-6.368,3.03c-2.452,0.081-4.833-0.859-6.561-2.585c-0.647-0.647-1.304-1.305-1.954-1.968c-1.747-1.746-2.688-4.164-2.582-6.633c0.107-2.469,1.254-4.797,3.15-6.39c1.047-0.888,2.079-1.797,3.116-2.7c0.008,0.008,0.01,0.019,0.018,0.027l14,14c0.01,0.01,0.023,0.013,0.033,0.022C21.379,56.831,20.42,57.892,19.479,58.964z M23.661,54.278L9.793,40.41c10.446-9.195,20.378-19.088,29.643-29.529l13.762,13.762C42.883,34.037,32.987,43.966,23.661,54.278z M58.961,19.48c-0.001,0.001-0.002,0.002-0.003,0.003c-1.434,1.26-2.856,2.537-4.275,3.817L40.757,9.374c1.227-1.399,2.45-2.801,3.653-4.219c1.591-1.893,3.92-3.04,6.392-3.147C50.928,2.003,51.055,2,51.181,2c2.338,0,4.601,0.932,6.259,2.59c0.652,0.653,1.313,1.313,1.963,1.97c1.727,1.728,2.668,4.117,2.585,6.557C61.905,15.556,60.802,17.875,58.961,19.48z"/>
          <path d="M36.007,32.037h-2.586l1.829-1.829c0.391-0.391,0.391-1.024,0-1.414c-0.391-0.391-1.024-0.391-1.414,0l-1.829,1.829v-2.585c0-0.552-0.448-1-1-1c-0.552,0-1,0.448-1,1v2.585l-1.829-1.829c-0.391-0.391-1.023-0.391-1.414,0c-0.391,0.391-0.391,1.023,0,1.414l1.829,1.829h-2.586c-0.552,0-1,0.448-1,1c0,0.552,0.448,1,1,1h2.586l-1.829,1.829c-0.391,0.391-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293c0.256,0,0.512-0.098,0.707-0.293l1.829-1.829v2.587c0,0.552,0.448,1,1,1c0.552,0,1-0.448,1-1v-2.587l1.829,1.829c0.195,0.195,0.451,0.293,0.707,0.293c0.256,0,0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414l-1.829-1.829h2.586c0.552,0,1-0.448,1-1C37.007,32.485,36.559,32.037,36.007,32.037z"/>
        </g></path></svg>`;
}
export default class Icon extends L.Icon {
  constructor(options) {
    super(options);
    let iconOptions = {
      iconSize: [30, 50],
      iconAnchor: [15, 50],
      popupAnchor: [2, -40],
      shadowAnchor: [39, 45],
      shadowSize: [54, 51],
      className: 'vector-marker',
      prefix: 'fa',
      spinClass: 'fa-spin',
      extraClasses: '',
      extraDivClasses: '',
      icon: 'home',
      markerColor: '',
      iconColor: 'white',
      viewBox: '0 0 32 52',
    };
    if (!options.markerColor) {
      iconOptions.iconSize = [30, 30];
      iconOptions.iconAnchor = [15, 40];
      iconOptions.popupAnchor = [2, -30];
      iconOptions.shadowAnchor = [19, 12];
      iconOptions.shadowSize = [27, 25];
      iconOptions.viewBox = '0 0 35 35';
    }
    L.Util.setOptions(this, iconOptions)
    L.Util.setOptions(this, options)
  }
  
  createIcon(oldIcon) {
    const div = (oldIcon && oldIcon.tagName === 'DIV' ? oldIcon : document.createElement('div'))
    const options = this.options
    const pin_path = options.map_pin || mapPin;
    if (options.markerColor !== '')
      div.innerHTML = `<svg width="${options.iconSize[0]}px" height="${options.iconSize[1]}px" viewBox="${options.viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="${pin_path}" fill="${options.markerColor}"></path></svg>`
    else
      div.innerHTML = "";
    if (options.icon) {
      if (options.icon == 'user') {
        div.innerHTML = Skis("black mt2 fa-rotate-45c");
        options.iconColor = 'white';
        options.extraClasses = 'fa-rotate-45c';
        options.extraClasses2 = 'ml2';
      }
      if (options.icon == 'user-secret') {
        if (Math.random() <= 0.5) {
          div.innerHTML = Skis("black mt2 fa-rotate-45c");
          options.extraClasses = 'fa-rotate-45c';
          options.extraClasses2 = 'ml2';
        } else {
          div.innerHTML = Snowboards("black ml2 mt3");
          options.extraClasses = 'fa-rotate-45m';
          options.extraClasses2 = 'ml1';
        }
        //let React = require('react');
        // ReactDOM.render(<SnowboardIcon className="ml2 mt3"/>, div);
        // div.appendChild(<SnowboardIcon className="ml2 mt3"/>);
        options.iconColor = 'white';
      }
      if (options.icon == 'star') {
        div.appendChild(this._createInner('hotel'));
        options.extraClasses = 'ml2';
        options.iconColor = 'yellow';
      }
      div.appendChild(this._createInner());
    }
    options.className += options.className.length > 0 ? ' ' + options.extraDivClasses : options.extraDivClasses
    this._setIconStyles(div, 'icon')
    this._setIconStyles(div, `icon-${options.markerColor}`)
    // div.appendChild(this.createShadow())
    return div
  }
  
  createShadow() {
    const div = document.createElement('div')
    this._setIconStyles(div, 'shadow')
    return div
  }
  
  _createInner(icon) {
    const i = document.createElement('i');
    const options = this.options;
    if (!icon) {
      icon = options.icon;
    }
    if (options.icon == 'user-secret' || options.icon == 'user') {
      i.classList.add('fa-lg');
      i.classList.add('fa-2x');
    }
    i.classList.add(options.prefix)
    if (options.extraClasses) {
      i.classList.add(options.extraClasses)
    }
    if (options.extraClasses2) {
      i.classList.add(options.extraClasses2)
    }
    if (icon.slice(0, options.prefix.length + 1) === options.prefix + '-') {
      i.classList.add(icon)
    } else {
      i.classList.add(options.prefix + '-' + icon)
    }
    if (options.spin && typeof options.spinClass === 'string') {
      i.classList.add(options.spinClass)
    }
    if (options.iconColor) {
      if (options.iconColor === 'white' || options.iconColor === 'black') {
        i.classList.add('icon-' + options.iconColor)
      } else {
        i.style.color = options.iconColor
      }
    }
    if (options.iconSize) {
      i.style.width = options.iconSize[0] + 'px'
    }
    return i
  }
  
  _setIconStyles(img, name) {
    const options = this.options
    const size = L.point(options[(name === 'shadow' ? 'shadowSize' : 'iconSize')])
    let anchor = void 0
    if (name === 'shadow') {
      anchor = L.point(options.shadowAnchor || options.iconAnchor)
    } else {
      anchor = L.point(options.iconAnchor)
    }
    if (!anchor && size) {
      anchor = size.divideBy(2, true)
    }
    img.className = 'vector-marker-' + name + ' ' + options.className
    if (anchor) {
      img.style.marginLeft = (-anchor.x) + 'px'
      img.style.marginTop = (-anchor.y) + 'px'
    }
    if (size) {
      img.style.width = size.x + 'px'
      img.style.height = size.y + 'px'
    }
  }
}
