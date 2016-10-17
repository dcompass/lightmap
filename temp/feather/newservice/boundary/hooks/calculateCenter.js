/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import  L from '../../../map/Leaflet';
export default function () {
  return function calculateCenter(hook) {
    if (hook.params.provider) {
      hook.result.map((boundary, index) => {
        const latlng = [];
        let bounds, center;
        boundary.boundaryRects.map(rect => {
          const southWest = L.latLng(rect.southWest[0], rect.southWest[1]);
          const northEast = L.latLng(rect.northEast[0], rect.northEast[1]);
          latlng.push(northEast);
          latlng.push(southWest);
        });
        if (latlng.length > 0) {
          bounds = new L.LatLngBounds(latlng);
          center = bounds.getCenter();
        } else {
          center = { lat: 0, lng: 0 };
        }
        console.log('center:');
        console.log(center);
        // update center in boundary resort
        let data = {
          center: [center.lat, center.lng]
        };
        hook.app.service('boundary').patch(boundary._id, data)
          .then((result) => {
            console.log(result);
          }).catch(err=>console.log(err));
        hook.result[index].center = center;
        hook.result[index].bounds = bounds;
      });
    }
    return hook;
  };
}
