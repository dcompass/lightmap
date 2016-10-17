/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
const DisplayMap = ({
  Map,
  reloadMap,
  lng,
  lat
}) => {
  console.log("renderMap:", reloadMap, lng, lat);
  return (
    <Map lat={lat} lng={lng}/>
  )
};
DisplayMap.propTypes = {
  Map: PropTypes.any,
  lng: PropTypes.string,
  lat: PropTypes.string,
};
export default DisplayMap;
