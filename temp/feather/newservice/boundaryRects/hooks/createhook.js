/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import  L from '../../../map/Leaflet';
export default function () {
  return function boundreload(hook) {
    if (hook.params.provider && hook.params.user && hook.params.user.uuid) {
      const query = { uuid: hook.data.boundaryId };
      return hook.app.service('boundary').find({ query })
        .then((results) => {
          if (results.length > 0) {
            let latlng = [];
            let center, southWest, northEast;
            let bounds = results[0].bounds;
            if ((bounds._southWest.lat !== 0) && (bounds._northEast.lat !== 0)) {
              southWest = L.latLng(bounds._southWest.lat, bounds._southWest.lng);
              northEast = L.latLng(bounds._northEast.lat, bounds._northEast.lng);
              latlng.push(northEast);
              latlng.push(southWest);
            }
            bounds = hook.data.bounds;
            southWest = L.latLng(bounds._southWest.lat, bounds._southWest.lng);
            northEast = L.latLng(bounds._northEast.lat, bounds._northEast.lng);
            latlng.push(northEast);
            latlng.push(southWest);
            if (latlng.length > 0) {
              bounds = new L.LatLngBounds(latlng);
              center = bounds.getCenter();
            } else {
              center = { lat: 0, lng: 0 };
            }
            let data = {
              center: [center.lat, center.lng],
              bounds
            };
            const query = { uuid: hook.data.boundaryId };
            hook.app.service('boundary').patch(null, data, { query })
              .then((result) => {
                console.log(result);
              }).catch(err=>console.log(err));
            hook.data.createdBy = hook.params.user.uuid;
            return hook;
          }
        });
      hook.data.createdBy = hook.params.user.uuid;
    }
    return hook;
  };
}
