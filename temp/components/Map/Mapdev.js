/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { Component, PropTypes } from 'react';
import L from 'mapbox.js';
import Toggle from 'material-ui/Toggle';
import { observer } from 'mobx-react';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import { generateUUID } from '~/utils/uuid';
import IconButton from 'material-ui/IconButton';
import dispatch from '~/core/dispatch';
import { MapCard } from './MapCard/admin';
import styles from './Map.css';
import FontIcon from '../Material/FontIcon';
import { displayIcons, downloadMarkers, hideDownloadDialog } from './ToolBarUtils';
const handleOfflineToggle = () => {
  dispatch('auth.constant.toggleOffline');
};
const handleMapToggle = () => {
  dispatch('map.setlockredraw', false);
  dispatch('map.toggleMapToggle');
};
const key = 'pk.eyJ1Ijoic2ltb25tYXAiLCJhIjoiY2luNHcwaGhyMDBydXdlbTJwZTdza2NkbSJ9.GZGPRYUc8yeYNOFEaQfM0A';
@observer(['context', 'appstate'])
class MapDev extends Component {
  static propTypes = {
    appstate: PropTypes.object.isRequired,
    lat: PropTypes.string.isRequired,
    lng: PropTypes.string.isRequired,
  }
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      flagDisableDragging: false
    }
    handleMapToggle(); //init in developpement mode
    if (props.lat === '0' || props.lng === '0')
      this.positionfly = L.latLng(45.3007, 6.5800);
    else
      this.positionfly = L.latLng(props.lat, props.lng);
    this.flagUseMapbox = false;
    this.mapState = props.appstate.map;
    this.mapView = null;
    this.user = props.appstate.auth.user;
    this.constant = props.appstate.auth.constant;
    this.colorSelectedResort = '';
    this.startLatLng = {};
    this.flagDragging = false;
    this.onMapMouseUp = this.onMapMouseUp.bind(this);
    this._handleWindowKeyUp = this._handleWindowKeyUp.bind(this);
    this.onMapMouseDown = this.onMapMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDraggingMode = this.onDraggingMode.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    if ((this.props.lat !== nextProps.lat) || (this.props.lng !== nextProps.lng)) {
      this.positionfly = L.latLng(nextProps.lat, nextProps.lng);
      this.mapView.setView(this.positionfly, 15);
    }
  }
  
  componentWillMount() {
    console.log("WillMount")
    dispatch('map.mapLoaded', false);
  }
  
  componentDidMount() {
    console.log('mountcp')
    this.createMap();
  }
  
  onDraggingMode() {
    if (this.state.flagDisableDragging) {
      this.setState({ flagDisableDragging: false });
      this.mapView.dragging.enable();
    } else {
      this.setState({ flagDisableDragging: true });
      this.mapView.dragging.disable();
    }
  }
  
  onMapMouseDown({ latlng }) {
    console.log(this.mapState.marker.activeMarkerType);
    // lock rectangle click on creation
    if (this.mapState.marker.activeMarkerType)
      dispatch('map.resort.setlock', true);
    else
      dispatch('map.resort.setlock', false);
    if (!this.flagDragging && this.state.flagDisableDragging) {
      this.startLatLng = latlng;
      this.flagDragging = true;
      console.info('e', latlng);
    }
  }
  
  onMouseMove({ latlng }) {
    if (this.flagDragging) {
      this.flagisDragging = true;
      console.info('e', latlng);
    }
  }
  
  onMapMouseUp({ latlng }) {
    const { activeMarkerType } = this.mapState.marker;
    const { activeResortType } = this.mapState.resort;
    if (activeMarkerType) {
      const actresort = dispatch('map.resort.getActiveResort');
      if (actresort) {
        const data = {
          boundaryId: actresort.uuid,
          type: activeMarkerType,
          uuid: generateUUID(),
          latlng: [latlng.lat.toFixed(4), latlng.lng.toFixed(4)],
        };
        dispatch('map.marker.create', data);
      } else {
        alert("select resort first")
      }
    }
    if (this.flagDragging) {
      if (this.flagisDragging && activeResortType) {
        const { startLatLng } = this;
        const bounds = L.latLngBounds(startLatLng, latlng);
        const data = {
          type: activeResortType,
          bounds: bounds,
          uuid: generateUUID(),
        };
        this.flagDragging = false;
        this.flagisDragging = false;
        dispatch('map.resort.create', data);
      } else if (!activeResortType) {
        alert('select first a resort');
      } else if (!this.flagisDragging) {
        alert('select two points');
      }
      this.flagDragging = false;
      this.flagisDragging = false;
    }
  }
  
  createMap(skip = false) {
    if ((!skip) && this.mapView) {
      return;
    }
    console.log('initMapdev')
    this.flagUseMapbox = (!this.props.appstate.auth.constant.isoffline);
    // reinit marker on Map to empty , if never we come back on the page it's important
    const options = { zoomControl: false, attributionControl: false };
    L.mapbox.accessToken = key;
    this.mapView = L.mapbox.map('map', this.flagUseMapbox ? 'simonmap.023dca42' : '', options);
    if (this.positionfly) {
      this.mapView.setView(this.positionfly, 15);
    } else {
      if (process.env.__DEV__)
        alert('please check your boundaryRect we have no center for courchevel')
    }
    new L.Control.Zoom({ position: 'bottomright' }).addTo(this.mapView);
    if (!this.flagUseMapbox) {
      L.tileLayer(`https://${process.env.HOSTIMG}/dist/tiles/{z}/{x}/{y}.png`, {
        minZoom: 10,
        maxZoom: 19,
        maxNativeZoom: 18,
        detectRetina: true,
        reuseTiles: true,
        attribution: 'SkiScool Server',
      }).addTo(this.mapView);
    }
    dispatch('map.mapLoaded', true);
    // to makeautorun work Mapbox is ready
    this.mapView.invalidateSize();
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
    const { overlayX, overlayY, flagShowOverlay, detail, overlayType, flagShowOverlay2, marker } = this.mapState;
    if (flagShowOverlay) {
      return (
        <div>
          <MapCard
            statemarker={marker}
            left={overlayX}
            top={overlayY}
            id={overlayType}
            width={300}
            height={150}
            detail={detail}
            open={flagShowOverlay2}
          />
        </div>
      );
    }
    return (<div/>);
  }
  
  render() {
    const { activeMarkerType, selectionsMarkerType, nbmark } = this.mapState.marker;
    const { activeResortType, nbrect } = this.mapState.resort;
    const { isoffline } = this.props.appstate.auth.constant;
    const { lockredraw, loadingMap, typeMapDev } = this.mapState; //we listen this observable to know if we need rerender markers on map
    console.log('renderMap')
    console.log('lockredraw:' + lockredraw)
    if (this.mapView && (!lockredraw || this.rebuild)) {
      //Because map.setMapView depend of admin state
      //things to load only one time when user switch to admin
      if (typeMapDev) {
        console.log('setadmin');
        dispatch('map.setMapViewDev', this.mapView, true);
      } else {
        console.log('setnoadmin');
        dispatch('map.setMapView', this.mapView, true);
      }
      if (this.mapView && (!this.eventattached || this.rebuild)) {
        this.eventattached = true;
        this.mapView.on('mouseup', this.onMapMouseUp);
        this.mapView.on('mousedown', this.onMapMouseDown);
        this.mapView.on('mousemove', this.onMouseMove);
      }
      this.rebuild = false;
    }
    if (this.mapView) {
      if ((this.flagUseMapbox) !== (!isoffline)) {
        this.mapView.remove();
        this.flagDragging = false;
        this.rebuild = true;
        this.flagisDragging = false;
        this.mapView = null;
        this.createMap(true);
      }
    }
    const compIconsHide = displayIcons(this.mapState.marker.icons, selectionsMarkerType, 'selectionsMarkerType');
    const compIcons = displayIcons(this.mapState.marker.icons, activeMarkerType, 'activeMarkerType');
    const compIconsResort = displayIcons(this.mapState.resort.resorts, activeResortType, 'activeResortType');
    const cursorStyle = this.state.flagDisableDragging ? { cursor: 'crosshair' } : null;
    return (
      <div className={styles.mapContainer}>
        <EventListener target="window" onKeyUp={this._handleWindowKeyUp}/>
        <div
          id="map"
          className={styles.map}
          style={cursorStyle}
        >
          { (!loadingMap) && <div className="center">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
            <span className="sr-only">Loading Map...</span></div>
          }
        </div>
        <div>
          <div className={`relative inline-block ${styles.toolBarAd}`}>
            {compIcons}
            <div className="right">
              {compIconsHide}
              <div style={{ maxWidth: 80 }} className="clearfix right">
                <Toggle
                  label={this.flagUseMapbox ? 'Online' : 'Offline'}
                  defaultToggled={this.flagUseMapbox}
                  onToggle={handleOfflineToggle}
                />
              </div>
              <div style={{ maxWidth: 80 }} className="clearfix right">
                <Toggle
                  label={(typeMapDev) ? 'Dev' : 'Production'}
                  defaultToggled={typeMapDev}
                  onToggle={handleMapToggle}
                />
              </div>
            </div>
          </div>
          <div className={styles.toolBarbot}>
            {compIconsResort}
            <IconButton tooltip="Rectangle" className="right">
              <FontIcon
                className="red fa fa-crosshairs fa-2x fa-fw"
                onClick={this.onDraggingMode}
                color={(this.state.flagDisableDragging) ? "#ffff00" : ''}
                hoverColor="#ffff00"
              />
            </IconButton>
            <IconButton tooltip="Download" className="right">
              <FontIcon
                className="red fa fa-download fa-2x fa-fw"
                onClick={downloadMarkers}
                color={(this.state.flagDisableDragging) ? "#ffff00" : ''}
                hoverColor="#ffff00"
              />
            </IconButton>
          </div>
        </div>
        {this.renderMapOverlay()}
      
      
      </div>
    
    );
  }
}
export default MapDev;
