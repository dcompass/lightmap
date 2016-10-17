/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

/**
 * Created by BaeBae on 9/6/16.
 */
// eslint-disable import/no-unresolved
import React from 'react';
import { observable, action } from 'mobx';
import { extend, toggle } from '~/core/decorators';
import resort from './resort';
import marker from './marker';
import { service } from '~/shared/app';
import dispatch from '~/core/dispatch';
@toggle('toggleMapToggle', 'typeMapDev')
@extend({
  marker,
  resort,
})
export default class Map {
  @observable flagShowOverlay = false;
  @observable flagShowOverlay2 = false;
  overlayType = 'markers';
  lockredraw = false;
  @observable loadingMap = false;
  @observable typeMapDev = false;
  overlayX = 0;
  overlayY = 0;
  @observable detail = {};
  mapView = '';
  detailsMarker = [];
  
  setOverlay(X, Y) {
    this.overlayX = X;
    this.overlayY = Y;
  }
  
  @action
  mapLoaded(val) {
    this.loadingMap = val;
  }
  
  @action
  flyto(pos) {
    this.mapView.setView(pos, 15);
  }
  
  setlockredraw(val) {
    this.lockredraw = val;
    dispatch('auth.constant.setmaplock', val);
  }
  
  @action
  updateFieldDetails(name, value) {
    this.detail[name] = value;
    this.detail = { ...this.detail }
  }
  
  @action
  setDetail(detail) {
    this.detail.Adress = detail.adr_address;
    this.detail.Name = detail.name;
    this.detail.Site = detail.website;
    this.detail.Number = detail.international_phone_number;
  }
  
  @action
  saveDetail(marker) {
    // let typeservice = ((marker.options.item.placeId) ? 'googleMarkers' : 'markers'));
    let data = {
      uuid: marker.options.item.uuid,
      boundaryId: marker.options.item.boundaryId,
      detail: {
        adr_address: this.detail.Adress,
        name: this.detail.Name,
        website: this.detail.Site,
        international_phone_number: this.detail.Number,
      }
    };
    service('markers').patch(null, data, { query: { uuid: data.uuid } })
      .then((a) => {
        console.log(a);
      });
  }
  
  @action
  showMapOverlayAdmin2() {
    this.flagShowOverlay2 = true;
  }
  
  @action
  showOverlay(type) {
    this.lockredraw = true;
    this.overlayType = type;
    this.flagShowOverlay = true;
  }
  
  @action
  closeOverlay() {
    this.flagShowOverlay = false;
    this.flagShowOverlay2 = false;
  }
  
  @action
  showMapOverlayAdmin(thing, type) {
    //thing can be a marker or rectangle
    let details, transformMarker, transformMap, translateValue, translateValue1;
    this.detail.Adress = "";
    this.detail.Name = "";
    this.detail.Site = "";
    this.detail.Number = "";
    if (thing._icon) {
      transformMarker = thing._icon.style.transform;
      transformMap = this.mapView._mapPane.style.transform;
      const results1 = transformMarker.match(/translate3d\((.+)px,(.+)px,(.+)px\)/);
      const results2 = transformMap.match(/translate3d\((.+)px,(.+)px,(.+)px\)/);
      translateValue = results1.slice(1, 3);
      translateValue1 = results2.slice(1, 3);
    } else {
      transformMap = this.mapView._mapPane.style.transform;
      const results2 = transformMap.match(/translate3d\((.+)px,(.+)px,(.+)px\)/);
      translateValue1 = results2.slice(1, 3);
      let svg = thing._path.getAttribute('d');
      var pattern = /\-?\d+/ig;
      var newd = svg.match(pattern);
      translateValue = [(parseInt(newd[0]) + (parseInt(newd[4]) - parseInt(newd[2])) / 2), parseInt(newd[3]) + 16];
    }
    const overlayX = parseInt(translateValue[0]) + parseInt(translateValue1[0]);
    const overlayY = parseInt(translateValue[1]) + parseInt(translateValue1[1]);
    this.setOverlay(overlayX, overlayY);
    this.detailsMarker = [];
    if (thing.options.item.detail) {
      //todo popup to display description title
      details = thing.options.item.detail;
      this.setDetail(details);
    }
    this.showOverlay(type);
  }
  
  destroy() {
    console.log("destroyMap")
    this.marker.reInitAll();
    this.mapView.remove();
    this.mapView = null;
  }
  
  setMapView(mapView, force = false) {
    let boundaryId;
    this.setlockredraw(true);
    this.mapView = mapView;
    this.marker.reInitAll();
    //used to refresh the scene because no one observable in other function upper
    this.resort.initialize().then((res1)=> {
      console.log('nodev:' + res1);
      const resort = this.resort.getActiveResort();
      if (resort)
        boundaryId = resort.uuid;
      this.marker.initialize(boundaryId, force).then((res2)=> {
        console.log('nodev:' + res2);
        if (process.env.NODE_ENV == 'development')
          this.setlockredraw(false);
      })
    })
  }
  
  setMapViewDev(mapView, force = false) {
    let boundaryId;
    this.setlockredraw(true);
    this.mapView = mapView;
    this.marker.reInitAll(); //delete instance object on Map if there is
    //used to refresh the scene because no one observable in other function upper
    this.resort.initialize().then((res1)=> {
      console.log('dev:' + res1);
      const resort = this.resort.getActiveResort();
      if (resort)
        boundaryId = resort.uuid;
      this.marker.initialize(boundaryId, force).then((res2)=> {
        console.log('dev:' + res2);
        this.setlockredraw(false);
      })
    })
  }
}
