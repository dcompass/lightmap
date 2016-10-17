/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

/**
 * Created by BaeBae on 9/8/16.
 */
import http from 'http';
import fs from 'fs';
const d2r = Math.PI / 180;
const r2d = 180 / Math.PI;
const pointToTileFraction = (latlng, level) => {
  const sin = Math.sin(latlng.lat * d2r);
  const z2 = Math.pow(2, level);
  const x = z2 * (latlng.lon / 360 + 0.5);
  const y = z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);
  return [x, y, level];
};
const getTileNumberFromGeoPoint = (latlng, level) => {
  const tile = pointToTileFraction(latlng, level);
  return {
    x: Math.floor(tile[0]),
    y: Math.floor(tile[1]),
  };
};
export const convertGeoAreaIntoTileIndex = (area) => {
  const ret = {};
  ret.topLeft = getTileNumberFromGeoPoint(area.topLeft, area.level);
  ret.bottomRight = getTileNumberFromGeoPoint(area.bottomRight, area.level);
  return ret;
};
export const downloadFile = (url, path, time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const file = fs.createWriteStream(path);
      http.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            console.info("next")
            resolve();
          });
        });
      }).on('error', (err) => {
        file.close(() => {
          fs.unlink(path);
          reject(err);
        });
      });
    }, time);
  });
};

