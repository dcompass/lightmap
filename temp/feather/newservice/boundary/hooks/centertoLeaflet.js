import  L from '../../../map/Leaflet';
export default function () {
  return function latlngCenter(hook) {
    if (hook.params.provider) {
      hook.result.map((boundary, index) => {
        hook.result[index].center = L.latLng(boundary.center[0], boundary.center[1]);
      })
    }
  }
}