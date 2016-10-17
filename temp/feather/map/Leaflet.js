/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

const L = {};
L.Util = {
  extend: function (dest) { // (Object[, Object, ...]) ->
    var sources = Array.prototype.slice.call(arguments, 1),
      i, j, len, src;
    for (j = 0, len = sources.length; j < len; j++) {
      src = sources[j] || {};
      for (i in src) {
        if (src.hasOwnProperty(i)) {
          dest[i] = src[i];
        }
      }
    }
    return dest;
  }
}
L.extend = L.Util.extend;
L.LatLng = function (lat, lng, alt) { // (Number, Number, Number)
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
  }
  this.lat = lat;
  this.lng = lng;
  if (alt !== undefined) {
    this.alt = parseFloat(alt);
  }
};
L.extend(L.LatLng, {
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
});
L.LatLng.prototype = {
  // Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
  // TODO move to projection code, LatLng shouldn't know about Earth
  distanceTo: function (other) { // (LatLng) -> Number
    other = L.latLng(other);
    var R = 6378137, // earth radius in meters
      d2r = L.LatLng.DEG_TO_RAD,
      dLat = (other.lat - this.lat) * d2r,
      dLon = (other.lng - this.lng) * d2r,
      lat1 = this.lat * d2r,
      lat2 = other.lat * d2r,
      sin1 = Math.sin(dLat / 2),
      sin2 = Math.sin(dLon / 2);
    var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
};
L.latLng = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
  if (a instanceof L.LatLng) {
    return a;
  }
  if (a === undefined || a === null) {
    return a;
  }
  if (typeof a === 'object' && 'lat' in a) {
    return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
  }
  if (b === undefined) {
    return null;
  }
  return new L.LatLng(a, b);
};
L.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
  if (!southWest) {
    return;
  }
  var latlngs = northEast ? [southWest, northEast] : southWest;
  for (var i = 0, len = latlngs.length; i < len; i++) {
    this.extend(latlngs[i]);
  }
};
L.LatLngBounds.prototype = {
  // extend the bounds to contain the given point or bounds
  extend: function (obj) { // (LatLng) or (LatLngBounds)
    if (!obj) {
      return this;
    }
    var latLng = L.latLng(obj);
    if (latLng !== null) {
      obj = latLng;
    } else {
      obj = L.latLngBounds(obj);
    }
    if (obj instanceof L.LatLng) {
      if (!this._southWest && !this._northEast) {
        this._southWest = new L.LatLng(obj.lat, obj.lng);
        this._northEast = new L.LatLng(obj.lat, obj.lng);
      } else {
        this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
        this._southWest.lng = Math.min(obj.lng, this._southWest.lng);
        this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
        this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
      }
    } else if (obj instanceof L.LatLngBounds) {
      this.extend(obj._southWest);
      this.extend(obj._northEast);
    }
    return this;
  },
  getCenter: function () { // -> LatLng
    return new L.LatLng(
      (this._southWest.lat + this._northEast.lat) / 2,
      (this._southWest.lng + this._northEast.lng) / 2);
  }
};
export default L;
