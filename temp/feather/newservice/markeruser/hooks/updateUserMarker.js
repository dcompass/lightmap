/**
 * Created by kitty on 9/29/16.
 */
import uuid from 'node-uuid';
export default function updateUserMarker() {
  return (hook) => {
    if (hook.params.provider && hook.data.requestType === 'updateUserLocation') {
      const query = { createdBy: hook.data.createdBy, tracking: true };
      const services = hook.app.service('markeruser');
      const latlng = [hook.data.latitude, hook.data.longitude];
      return services.find({ query })
        .then((result) => {
          if (result.length === 0) {
            const data = {
              uuid: uuid.v4(),
              latlng,
              tracking: true,
              createdBy: hook.data.createdBy,
              type: 'skier',
            };
            return services.create(data)
              .then(() => hook)
              .catch(e => console.info('error', e));
          }
          return services.patch(null, { latlng }, query)
            .then(() => hook)
            .catch(e => console.info('error', e));
        });
    }
    return hook;
  }
}
