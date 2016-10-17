/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

/**
 * Created by BaeBae on 9/14/16.
 */
import _ from 'lodash';
import { collectGoogleMarkers } from './collectGoogleMarkers';
import app from '../app';
function fixtures() {
  // console.log('Creating instructors');
  // return generateUsers();
  // const topLeft = [45.3027, 6.5897];
  // const bottomRight = [45.2982, 6.5794];
  // collectGoogleMarkers({ app }, topLeft, bottomRight)
  //   .then((markers) => {
  //     console.info('collectGoogleMarkers result', markers);
  //     _.map(markers, (marker) => {
  //       const data = {
  //         placeId: marker.placeId,
  //         name: marker.name,
  //         type: marker.type,
  //         latlng: [marker.location.lat, marker.location.lng],
  //         detail: marker.placeDetail,
  //       };
  //       app.service('googleMarkers').create(data)
  //         .then((res) => res)
  //         .catch((err) => console.info('err', err));
  //     });
  //   });
  return app.service('boundaryRects').find({})
    .then(results => {
      const promises = results.map((rect) => {
        console.info('rect', rect);
        return collectGoogleMarkers({ app }, rect.northEast, rect.southWest)
          .then((markers) => {
            const createPromises = _.map(markers, (marker) => {
              const data = {
                placeId: marker.placeId,
                rectangleID: rect.uuid,
                name: marker.name,
                type: marker.type,
                latlng: [marker.location.lat, marker.location.lng],
                detail: marker.placeDetail,
              };
              return app.service('googleMarkers').create(data);
            });
            return Promise.all(createPromises);
          });
      });
      return Promise.all(promises)
        .then(() => console.info('completed'));
    });
}
fixtures();
