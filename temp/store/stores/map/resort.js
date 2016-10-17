/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import L from 'mapbox.js';
import { observable, action } from 'mobx';
import { service } from '~/shared/app';
import dispatch from '~/core/dispatch';
import { generateUUID } from '~/utils/uuid';
import {
  deepOrange200, yellow50, blueGrey800, pink600, deepPurple500
} from 'material-ui/styles/colors';
export default class Resort {
  @observable activeResortType = '';
  @observable nbrect = 0;
  @observable selectionsResortType = ['Courchevel', 'Meribel', 'Valthorens'];
  resorts = [];
  lock = false;
  // icons = {};
  rectangles = [];
  Maprectangles = [];
  activeRectangleUUID = '';
  
  initialize() {
    return dispatch('auth.constant.getBoundary', false, true) //true force reload resort
      .then((resorts) => {
        let rects = [];
        this.removePlaceRectangles();
        this.rectangles = [];
        this.Maprectangles = [];
        resorts.map((resort, index) => {
          resorts[index].vector = 'map';
          resorts[index].label = resort.name;
          resorts[index].bounds = resort.bounds;
          if (resort.center && resort.center.lat !== 0) {
            const data = {
              type: 'centermap',
              uuid: generateUUID(),
              resort: resort.name,
              color: resort.color,
              latlng: [parseFloat(resort.center.lat).toFixed(4), parseFloat(resort.center.lng).toFixed(4)],
            };
            dispatch('map.marker.addMakerConst', data);
          }
          if (dispatch('map.typeMapDev'))
            rects = rects.concat(resort.boundaryRects.map(rects=> {
              rects.type = resort.name;
              return rects;
            }));
        });
        this.resorts = resorts;
        if (dispatch('map.typeMapDev'))
          this.updateRectanglesInFilter(rects);
        const data = {
          type: 'locationuser',
          uuid: generateUUID(),
          color: "blue",
          latlng: [45.2987, 6.5817],
        };
        dispatch('map.marker.addMakerConst', data);
        return Promise.resolve('doneResorts');
      });
  }
  
  setlock(state) {
    this.lock = state;
  }
  
  @action
  updateRectanglesInFilter(data = []) {
    this.rectangles = data;
    let mydata = this.rectangles.filter((rectangle) => (this.activeResortType === rectangle.type));
    this.updateRectangles(mydata);
  }
  
  @action
  setActiveResortType(state) {
    console.log(state);
    if (state === this.activeResortType)
      this.activeResortType = '';
    else
      this.activeResortType = state;
    let resort = this.getActiveResort();
    if (resort.center && resort.center.lat != 0) {
      let positionfly = L.latLng(resort.center.lat, resort.center.lng);
      dispatch('map.flyto', positionfly);
    }
    dispatch('map.setlockredraw', false);
  }
  
  removePlaceRectangles() {
    let mapView = dispatch('map.mapView');
    this.Maprectangles.forEach((rectangle) => {
      mapView.removeLayer(rectangle);
    });
  }
  
  @action
  onRemoved(uuid) {
    let mapView = dispatch('map.mapView');
    this.rectangles = this.rectangles.filter(rectangle => rectangle.uuid !== uuid);
    this.Maprectangles.forEach((rectangle) => {
      if (rectangle.uuid === uuid)
        mapView.removeLayer(rectangle);
    });
    this.Maprectangles = this.Maprectangles.filter(rectangle => rectangle.uuid !== uuid);
    this.nbrect = this.Maprectangles.length; //rerender
  }
  
  @action
  createRectangleonMap(result) {
    let mapView = dispatch('map.mapView');
    this.rectangles.push(result);
    this.addPlaceRectangle(result, mapView);
    this.nbrect = this.Maprectangles.length; //rerender
    console.log(this.nbrect);
  }
  
  @action
  create(data) {
    let resort = this.getActiveResort();
    // let resort = this.resorts.filter((resort) => (resort.label === this.activeResortType));
    if (resort) {
      data.boundaryId = resort.uuid;
      // delete data.bounds;
      console.log(data);
      delete data.type;
      return service('boundaryRects').create(data)
        .then((result) => {
          console.log(result)
          this.createRectangleonMap(result);
        })
        .catch((e) => console.error('err', e));
    }
  }
  
  @action
  updateRectangles(rectangles) {
    let mapView = dispatch('map.mapView');
    this.removePlaceRectangles();
    rectangles.forEach((rectangle) => {
      this.addPlaceRectangle(rectangle, mapView);
    });
  }
  
  getResort(boundaryId) {
    let ret = null;
    this.resorts.map((boundary) => {
      if (boundary.uuid === boundaryId) {
        ret = boundary;
      }
    });
    return ret;
  }
  
  addPlaceRectangle(rectangle, mapView) {
    if (mapView) {
      let resort = this.getActiveResort();
      let bounds = new L.LatLngBounds(rectangle.bounds._northEast, rectangle.bounds._southWest);
      const mapRectangle = L.rectangle(L.latLngBounds(bounds), {
        item: { uuid: rectangle.uuid },
        color: resort.color,
        opacity: 0.8,
        fillOpacity: 0.5,
        weight: 1,
        draggable: true,
      }).addTo(mapView);
      mapRectangle.on('click', (e) => {
        if (!this.lock) {
          this.activeRectangleUUID = e.target.options.item.uuid;
          dispatch('map.showMapOverlayAdmin', e.target, 'rectangle');
        }
      });
      this.Maprectangles.push(mapRectangle);
    }
  }
  
  getActiveResort() {
    let resort = this.resorts.filter((resort) => (resort.label === this.activeResortType));
    if (resort.length)
      return resort[0];
    else
      return false;
  }
  
  @action
  remove(e) {
    const resort = this.getActiveResort();
    if (resort) {
      const query = { uuid: this.activeRectangleUUID, boundaryId: resort.uuid };
      return service('boundaryRects').remove(null, { query })
        .then(() => {
          this.onRemoved(this.activeRectangleUUID);
          this.activeRectangleUUID = '';
        });
    }
  }
  
  //todo below depending shema used
  @action
  onUpdated(uuid, bound) {
    this.Maprectangles.map((rectangle) => {
      if (rectangle.item.uuid === uuid) {
        rectangle.bound = bound;
      }
    });
  }
  
  @action
  update({ uuid, bound }) {
    //this.flagMoveMarker = false;
    if (dispatch('map.flagShowOverlay'))
      dispatch('map.flagShowOverlay.closeOverlay');
    return service('rectangles')
      .patch(null, { bound }, { query: { uuid } })
      .then((a) => this.onUpdated(uuid, bound));
  }
}
