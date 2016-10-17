/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { Component, PropTypes } from 'react';
import L from 'mapbox.js';
import { observer } from 'mobx-react';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import { generateUUID } from '~/utils/uuid';
import dispatch from '~/core/dispatch';
import { MapCard } from './MapCard';
import styles from './Map.css';
import { displayIconsSelections, displayIconsResort } from './ToolBarUtils';
const key = 'pk.eyJ1Ijoic2ltb25tYXAiLCJhIjoiY2luNHcwaGhyMDBydXdlbTJwZTdza2NkbSJ9.GZGPRYUc8yeYNOFEaQfM0A';
@observer(['context', 'appstate'])
class Map extends Component {
  static propTypes = {
    appstate: PropTypes.object.isRequired,
    lat: PropTypes.string.isRequired,
    lng: PropTypes.string.isRequired,
  }
  
  constructor(props, context) {
    super(props, context);
    console.log(props.lat, props.lng)
    if (props.lat === '0' || props.lng === '0') {
      this.positionfly = L.latLng(45.3007, 6.5800);
    } else {
      this.positionfly = L.latLng(props.lat, props.lng);
    }
    this.flagUseMapbox = false;
    this.mapState = props.appstate.map;
    this.mapView = null;
    this.user = props.appstate.auth.user;
    this.constant = props.appstate.auth.constant;
    this.colorSelectedResort = '';
    this.startLatLng = {};
    this._handleWindowKeyUp = this._handleWindowKeyUp.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    if ((this.props.lat !== nextProps.lat) || (this.props.lng !== nextProps.lng)) {
      this.positionfly = L.latLng(nextProps.lat, nextProps.lng);
      this.mapView.setView(this.positionfly, 15);
    }
  }
  
  componentWillMount() {
    console.log("WillMountnodev")
    dispatch('map.mapLoaded', false);
  }
  
  componentDidMount() {
    this.createMap();
  }
  
  createMap(skip = false) {
    if ((!skip) && this.mapView) {
      return;
    }
    // reinit marker on Map to empty , if never we come back on the page it's important
    const options = { zoomControl: false, attributionControl: false };
    L.mapbox.accessToken = key;
    this.mapView = L.mapbox.map('map', this.flagUseMapbox ? 'simonmap.023dca42' : '', options);
    if (this.positionfly) {
      this.mapView.setView(this.positionfly, 15);
    }
    new L.Control.Zoom({ position: 'bottomright' }).addTo(this.mapView);
    if (!this.flagUseMapbox) {
      L.tileLayer(`https://${process.env.HOSTIMG}/dist/tiles/{z}/{x}/{y}.png`, {
        minZoom: 10,
        maxZoom: 19,
        maxNativeZoom: 18,
        attribution: 'SkiScool Server',
      }).addTo(this.mapView);
    }
    dispatch('map.mapLoaded', true);
    // to makeautorun work Mapbox is ready
    setTimeout(() => {
      if (this.mapView)
        this.mapView.invalidateSize();
    }, 200);
    // });
  }
  
  _handleWindowKeyUp(event) {
    if (this.mapState.flagShowOverlay) {
      switch (keycode(event)) {
        case 'esc':
          dispatch("map.closeOverlay");
          break;
      }
    }
  }
  
  renderMapOverlay() {
    const { overlayX, overlayY, flagShowOverlay, detail, overlayType } = this.mapState;
    let detailsMarker = [];
    detailsMarker.push(<h2 key="nm">Name:{detail.Name}</h2>);
    detailsMarker.push(<p key="wb">website:<a href={detail.Site}>{detail.Name}</a></p>);
    detailsMarker.push(<p key="nu">Number:{detail.Number}`</p>);
    detailsMarker.push(<div key="ab">Adresse:
      <div dangerouslySetInnerHTML={{ __html: detail.Adress }}/>
    </div>);
    if (flagShowOverlay) {
      return (
        <MapCard
          left={overlayX}
          top={overlayY}
          id={overlayType}
          width={250}
          height={200}
          detail={detailsMarker}
        />
      );
    }
    return (<div/>);
  }
  
  render() {
    const { selectionsMarkerType } = this.mapState.marker;
    const { activeResortType } = this.mapState.resort;
    const { lockredraw, loadingMap } = this.mapState; //we listen this observable to know if we need rerender markers on map
    console.log('renderMap')
    console.log('lockredraw:' + lockredraw)
    if (this.mapView && !lockredraw) {
      //things to load only one time for normal user
      dispatch('map.setMapView', this.mapView);
      console.log('setadminno');
      //dispatch("map.marker.setMarkerAdmin", false);
    }
    const compIconsHide = displayIconsSelections(this.mapState.marker.icons, selectionsMarkerType);
    const compIconsResort = displayIconsResort(this.mapState.resort.resorts, activeResortType);
    // const compIconsResort = displayIcons(this.mapState.resort.resorts, activeResortType, 'activeResortType');
    return (
      <div className={styles.mapContainer}>
        <EventListener target="window" onKeyUp={this._handleWindowKeyUp}/>
        <div
          id="map"
          className={styles.map}
        >
          { (loadingMap) && <div className="center">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
            <span className="sr-only">Loading Map...</span></div>
          }
        </div>
        <div className={`relative inline-block ${styles.toolBar}`}>
          {compIconsHide}
        </div >
        <div className="right">
          {compIconsResort}
        </div >
        {this.renderMapOverlay()}
      </div>
    );
  }
}
export default Map;
