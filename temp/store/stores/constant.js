/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { observable, action, computed, autorun } from 'mobx';
import { app, service } from '~/shared/app';
import { toggle } from '~/core/decorators';
import dispatch from '~/core/dispatch';
@toggle('toggleOffline', 'isoffline')
export default class constant {
  boundaries = [];
  @observable resortselector = '';
  @observable ratings = 0;
  @observable priceMin = 300;
  @observable priceMax = 500;
  @observable gender = 'All';
  @observable isoffline = true;
  @observable isAdmin = false;
  seasons = [];
  fetchedboundaries = false;
  priceMinMin = 300;
  priceMaxMin = 310;
  priceMinMax = 490;
  priceMaxMax = 500;
  star0 = true;
  limitdispatched = false;
  MapRequire = require('../../components/Map').default;
  @observable maplock = true;
  @observable reloadMap = false;
  debug = false; //to simulate no logged user put this at true
  @action
  setmaplock(val) {
    this.maplock = val;
  }
  
  @action
  setreloadMap() {
    this.reloadMap = !this.reloadMap;
  }
  
  init() {
    /* this.boundaries.length = 20;
     this.seasons.length = 20;*/
    this.getBoundary();
    if (process.env.NODE_ENV === 'development') {
      autorun(() => {
        if (!this.switchAdmin && (!this.debug)) {
          if (this.isAdmin && (!this.maplock)) {
            dispatch('map.destroy');
            this.MapRequire = require('../../components/Map/Mapdev').default;
            this.setreloadMap();
            this.switchAdmin = true;
          }
        }
      });
    }
  }
  
  getIdfromName(name) {
    let resort = this.boundaries.filter((boundary) => boundary.name === name);
    if (resort[0])
      return resort[0]._id;
    else
      return this.boundaries[0]._id;
  }
  
  getLatLngfromName(name) {
    let resort = this.boundaries.filter((boundary) => boundary.name === name);
    if (resort[0])
      return resort[0].center;
    else
      return { lat: 0, lng: 0 };
  }
  
  setPathNamefromIdBoundary(id) {
    let regex, path;
    const route = window.__routes__.find(
      x => (
        x.component ? x.component === `./routes/Map` : null
      ));
    path = route.path;
    regex = new RegExp('\/:id\\?', 'g');
    path = path.replace(regex, '');
    regex = new RegExp('\/:ie\\?', 'g');
    path = path.replace(regex, '');
    this.pathselector = path + '/' + this.getNamefromIdBoundary(id);
  }
  
  getNamefromIdBoundary(id) {
    let resort = this.boundaries.filter((boundary) => boundary._id === id);
    if (resort[0])
      return resort[0].name;
    else
      return '';
  }
  
  setPathCenterfromIdBoundary(id) {
    let location, path, regex;
    let resort = this.boundaries.filter((boundary) => boundary._id === id);
    if (resort[0])
      location = resort[0].center;
    else
      location = { lat: 0, lng: 0 };
    const route = window.__routes__.find(
      x => (
        x.component ? x.component === `./routes/Map` : null
      ));
    path = route.path;
    regex = new RegExp('\/:id\\?', 'g');
    path = path.replace(regex, '');
    regex = new RegExp('\/:ie\\?', 'g');
    path = path.replace(regex, '');
    path += '/' + location.lat.toFixed(4) + '/' + location.lng.toFixed(4);
    this.pathselector = path;
  }
  
  @computed
  get theSeasons() {
    return this.seasons;
  }
  
  getBoundary(nameResortInit = false, force = false) {
    if (this.fetchedboundaries && (!force)) {
      return Promise.resolve(this.boundaries);
    } else {
      return service('boundary').find()
        .then(action(result => {
            this.boundaries = result;
            // this.setPathCenterfromIdBoundary(this.resortselector);
            this.fetchedboundaries = true;
            return result;
          }
        ));
    }
  }
}
