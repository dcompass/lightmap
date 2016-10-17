/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import L from 'mapbox.js';
import { observable, action } from 'mobx';
import { service } from '~/shared/app';
import VectorMarkers from './src/VectorMarkers';
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download';
import without from 'lodash/without';
import dispatch from '~/core/dispatch';
import {
  deepOrange200, yellow50, blueGrey800, pink600, deepPurple500, deepPurple200, deepPurple700
} from 'material-ui/styles/colors';
export default class Marker {
  allmarkers = []; // contains all markers
  mapMarkers = []; // contains marker who can be moved and removed
  constmarkers = []; // contains marker who can not be moved and removed (locationuser and centermap)
  @observable activeMarkerType = '';
  @observable nbmark = 0;
  //below it's the currentselection of type marker
  @observable selectionsMarkerType = ['locationuser', 'centermap', 'hotel', 'hotelluxe', 'chalet', 'restaurant', 'skier', 'instructor'];
  icons = {};
  activeMarkerUUID = '';
  activeMarker = '';
  
  init() {
    if (process.env.NODE_ENV === 'development') {
      this.selectionsMarkerType = ['locationuser', 'centermap', 'hotel', 'hotelluxe', 'supermarket', 'store', 'chalet', 'restaurant', 'skier', 'instructor', 'other'];
    }
    this.listusers = [];
    this.icons = {
      locationuser: {
        label: 'locationuser',
      },
      centermap: {
        vector: 'crosshairs',
        color: yellow50,
        label: 'centermap',
      },
      hotel: {
        vector: 'hotel',
        path: '/dist/icons/marker/hotel',
        color: blueGrey800,
        label: 'Hotel',
      },
      supermarket: {
        vector: 'shopping-basket',
        color: 'black',
        label: 'Supermarket',
      },
      hotelluxe: {
        vector: 'star',
        path: '/dist/icons/marker/hotel',
        color: deepPurple700,
        label: 'Hotel luxe',
      },
      chalet: {
        path: '/dist/icons/marker/chalet',
        vector: 'home',
        color: 'black',
        label: 'Chalet',
      },
      restaurant: {
        path: '/dist/icons/marker/restaurant',
        vector: 'cutlery',
        label: 'Restaurant',
        size: 'fa-2x',
      },
      store: {
        path: '/dist/icons/marker/other',
        vector: 'shopping-bag',
        label: 'Store',
      },
      other: {
        vector: 'question',
        path: '/dist/icons/marker/other',
        label: 'Other',
      },
      skier: {
        vector: 'user',
        label: 'Skier',
        color: deepPurple500,
        size: 'fa-2x',
      },
      instructor: {
        vector: 'user-secret',
        label: 'Skier',
        color: pink600,
        size: 'fa-3x',
      },
      download: {
        icon: FileCloudDownload,
        vector: 'download',
        path: '/icons/marker/other',
        label: 'Download',
      }
    };
    this.VectorMarkers = VectorMarkers;
    this.onMapdragend = this.onMapdragend.bind(this);
    this.onMapdragstart = this.onMapdragstart.bind(this);
    this.onMyClick = this.onMyClick.bind(this);
  }
  
  removeMakerConst() {
    this.constmarkers = [];
  }
  
  addMakerConst(result) {
    // do not add center marker if no activeresort selected
    if (result.resort) {
      const resortActive = dispatch('map.resort.activeResortType');
      if (!resortActive)
        return;
      if (resortActive === result.resort)
        this.constmarkers.push(result);
    } else {
      this.constmarkers.push(result);
    }
  }
  
  reInitAll() {
    this.removePlaceMarkers();
    this.allmarkers = [];
    this.constmarkers = [];
    this.mapMarkers = [];
  }
  
  initialize(uuid, force = false) {
    let data = {};
    let servicemarker = 'markers';
    console.log("getmarkers");
    if (!force && this.allmarkers.length) {
      //this.updateMarkerInfo(this.allmarkers);
      return Promise.resolve('doneMarkers');
    }
    if (uuid)
      data = { boundaryId: uuid };
    /*if (dispatch('map.typeMapDev')) {
     servicemarker = 'googleMarkers';
     }*/
    return service(servicemarker).find({ query: data }).then((result) => {
      //this.allmarkers = result.concat(resultmarkers);
      this.allmarkers = result;
      this.allmarkers = this.allmarkers.concat(this.constmarkers);
      this.updateMarkerInfo(this.allmarkers);
      return Promise.resolve('doneMarkers');
    }).catch((err) => {
      console.info('get googleMarkers error', err);
    });
  }
  
  updateMarkers(markers) {
    let mapView = dispatch('map.mapView');
    this.removePlaceMarkers();
    markers.forEach((marker) => {
      if (marker.uuid) {
        this.addPlaceMarker(marker, mapView);
      }
    });
  }
  
  removePlaceMarkers() {
    let mapView = dispatch('map.mapView');
    this.mapMarkers.forEach((marker) => {
      if (marker.title)
        marker.off('click');
      mapView.removeLayer(marker);
    });
  }
  
  updateMarkerInfo(data = []) {
    let mydata = this.allmarkers.filter((marker) => this.selectionsMarkerType.includes(marker.type));
    this.updateMarkers(mydata);
  }
  
  @action
  setActiveMarkerType(state) {
    if (state === this.activeMarkerType)
      this.activeMarkerType = '';
    else
      this.activeMarkerType = state;
  }
  
  @action
  setHideMarkerType(state) {
    if (!this.selectionsMarkerType.includes(state))
      this.selectionsMarkerType.push(state);
    else
      this.selectionsMarkerType = without(this.selectionsMarkerType, state);
    console.log(without(this.selectionsMarkerType, state))
    let data = this.allmarkers.filter((marker) => this.selectionsMarkerType.includes(marker.type));
    this.updateMarkers(data);
  }
  
  addPositionMe(position, mapView) {
    L.marker([position.lat, position.lng], {
      icon: this.VectorMarkers.icon({
        icon: 'spinner',
        prefix: 'fa',
        markerColor: '#cb4b16',
        spin: true
      })
    }).addTo(mapView);
  }
  
  CreateIcon(markertype, markercolor) {
    let icon, MyIcon, mapIcon, size, color;
    MyIcon = this.icons[markertype];
    if (MyIcon && MyIcon.vector) {
      icon = MyIcon.vector;
      if (MyIcon.size)
        size = MyIcon.size;
      else
        size = 'fa-lg';
      if (markercolor) {
        color = markercolor;
      } else {
        if (MyIcon.color)
          color = MyIcon.color;
        else
          color = 'blue';
      }
      mapIcon = this.VectorMarkers.icon({ icon: icon, extraClasses: size, prefix: 'fa', iconColor: color });
    } else if (MyIcon) {
      icon = MyIcon.path;
      mapIcon = L.icon({
        iconUrl: `${icon}.svg`,
        iconSize: [50, 60],
        iconAnchor: [25, 60],
      });
    } else { //not recognize type just take in other
      icon = '/dist/icons/marker/other';
      mapIcon = L.icon({
        iconUrl: `${icon}.svg`,
        iconSize: [50, 60],
        iconAnchor: [25, 60],
      });
    }
    return mapIcon;
  }

// add marker when user tap position on map during marker type is selected
  addPlaceMarker(marker, mapView) {
    if (mapView) {
      let icon, MyIcon, mapIcon, size, color;
      const position = [marker.latlng[0], marker.latlng[1]];
      // console.log(marker.type);
      mapIcon = this.CreateIcon(marker.type, marker.color);
      let mOpt = {};
      if (marker.type === 'locationuser') {
        mOpt = {
          item: { uuid: marker.uuid, type: marker.type, color: marker.color }
        }
      } else if (marker.type === 'centermap') {
        mOpt = {
          icon: mapIcon,
          item: { uuid: marker.uuid, type: marker.type, color: marker.color }
        }
      } else {
        mOpt = {
          icon: mapIcon,
          title: 'Click me',
          item: {
            uuid: marker.uuid,
            detail: marker.detail,
            placeId: marker.placeId,
            boundaryId: marker.boundaryId,
            type: marker.type,
            color: marker.color
          },
          draggable: true
        };
      }
      const mapMarker = L.marker(position, mOpt).addTo(mapView);
      if ((marker.type !== 'centermap') && (marker.type !== 'locationuser')) {
        if (dispatch('map.typeMapDev')) {
          mapMarker.on('dragstart', this.onMapdragstart);
          mapMarker.on('dragend', this.onMapdragend);
        }
        mapMarker.on('click', this.onMyClick);
        /* mapMarker.on('mouseover', (e)=> {
         let nm, popup, lat, lng;
         let marker = e.target;
         lat = parseFloat(marker._latlng.lat);
         lng = parseFloat(marker._latlng.lng);
         if (marker.detail)
         nm = marker.detail.name;
         if (lat && lng)
         popup = L.popup({
         offset: [0, -40],
         }).setLatLng(marker._latlng).setContent(`${nm} <br/>position <br/> lat:${lat.toFixed(3)} long:${lng.toFixed(3)}`).openOn(mapView);
         });
         */
      } else {
        mapMarker.on('mouseover', (e)=> {
          let nm, popup, lat, lng;
          let marker = e.target;
          lat = parseFloat(marker._latlng.lat);
          lng = parseFloat(marker._latlng.lng);
          nm = "You re here";
          if (lat && lng)
            popup = L.popup({
              offset: [0, -40],
            }).setLatLng(marker._latlng).setContent(`${nm} <br/>position <br/> lat:${lat.toFixed(3)} long:${lng.toFixed(3)}`).openOn(mapView);
        });
        mapMarker.on('click', this.showTips);
      }
      this.mapMarkers.push(mapMarker);
    }
  }
  
  onMyClick(e) {
    this.activeMarker = e.target;
    dispatch('map.showMapOverlayAdmin', e.target, ((e.target.options.item.placeId) ? 'googleMarkers' : 'markers'));
  }
  
  onMapdragend(e) {
    this.activeMarker = e.target;
    this.update();
  }
  
  onMapdragstart(e) {
    console.log(e.target.options.item.uuid);
    this.activeMarker = e.target;
  }
  
  showTips(e) {
    e.target.bindPopup('yu re here').openPopup();
  }
  
  @action
  createMakeronMap(result) {
    let mapView = dispatch('map.mapView');
    this.allmarkers.push(result);
    this.addPlaceMarker(result, mapView);
    this.nbmark = this.mapMarkers.length; //rerender
  }
  
  @action
  create(data) {
    return service('markers')
      .create(data)
      .then((result) => {
        this.createMakeronMap(result);
      })
  }
  
  @action
  remove(e, type) {
    console.log(e, type);
    this.activeMarkerUUID = this.activeMarker.options.item.uuid;
    return service(type).remove(null, {
      query: {
        uuid: this.activeMarkerUUID
      }
    }).then((a) => {
      this.onRemoved(this.activeMarkerUUID);
      this.activeMarker = '';
      return service('markers')
        .remove(null, { query: { uuid: this.activeMarkerUUID } })
        .then((a) => {
          console.log(a);
        }).catch((err) => {
          console.info('remove error', err);
        });
    });
  }
  
  @action
  onRemoved(uuid) {
    let mapView = dispatch('map.mapView');
    this.mapMarkers.forEach((marker) => {
      if (marker.options.item && (marker.options.item.uuid === uuid))
        mapView.removeLayer(marker);
    });
    this.mapMarkers = this.mapMarkers.filter(marker => marker.options.item.uuid !== uuid);
    this.allmarkers = this.allmarkers.filter(marker => marker.uuid !== uuid);
    this.nbmark = this.mapMarkers.length;
  }
  
  @action
  setMarkerType(type) {
    this.update(type);
  }
  
  @action
  update(settype = false) {
    let latlng = this.activeMarker._latlng;
    const pos = [latlng.lat, latlng.lng];
    let data = { ...this.activeMarker.options.item, latlng: pos }
    let item = this.activeMarker.options.item;
    let uuid = data.uuid;
    if (settype)
      data.type = settype;
    else
      settype = data.type;
    //this.flagMoveMarker = false;
    if (dispatch('map.flagShowOverlay'))
      dispatch('map.flagShowOverlay.closeOverlay');
    service('markers')
      .patch(null, data, { query: { uuid: uuid } })
      .then((a) => {
        console.log(a);
      }).catch((err) => {
      console.info('service thenchangemarker upd error', err);
    });
  }
}