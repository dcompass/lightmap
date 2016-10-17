/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import  L from '../../../map/Leaflet';
export default function () {
  return function reinit(hook) {
    if (hook.params.provider && hook.params.user && hook.params.user.uuid) {
      const query = { boundaryId: hook.params.query.boundaryId };
      return hook.app.service('boundaryRects').find({ query })
        .then((results) => {
          if (results.length > 0) {
            let latlng = [];
            let bounds, center;
            results.map(rect => {
              let bounds = rect.bounds;
              const southWest = L.latLng(bounds._southWest.lat, bounds._southWest.lng);
              const northEast = L.latLng(bounds._northEast.lat, bounds._northEast.lng);
              latlng.push(northEast);
              latlng.push(southWest);
            });
            if (latlng.length > 0) {
              bounds = new L.LatLngBounds(latlng);
              center = bounds.getCenter();
            } else {
              center = { lat: 0, lng: 0 };
            }
            let data = {
              center: [center.lat, center.lng],
              bounds: { ...bounds }
            };
            console.info(data.bounds)
            const query = { uuid: hook.params.query.boundaryId };
            hook.app.service('boundary').patch(null, data, { query })
              .then((result) => {
                console.log(result);
              }).catch(err=>console.log(err));
            return hook;
          } else {
            let latlng = [];
            let bounds, center;
            const southWest = L.latLng(0, 0);
            const northEast = L.latLng(0, 0);
            latlng.push(northEast);
            latlng.push(southWest);
            bounds = new L.LatLngBounds(latlng);
            let data = {
              center: [0, 0],
              bounds: { ...bounds }
            };
            console.info('rinitbounds')
            const query = { uuid: hook.params.query.boundaryId };
            console.log(data);
            hook.app.service('boundary').patch(null, data, { query })
              .then((result) => {
                console.log(result);
              }).catch(err=>console.log(err));
          }
        });
    }
    return hook;
  };
}
