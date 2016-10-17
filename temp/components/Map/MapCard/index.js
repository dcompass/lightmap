/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { PropTypes } from 'react';
import styles from './style.css';
import { renderUserButtons } from '../ToolBarUtils';
export const MapCard = ({ left, top, detail, width, height, id }) => {
  const markerOverlayStyle = {
    position: 'absolute',
    top: top - height - 40,
    left: left - (width / 2) - 12.5,
    width,
    height,
  };
  return (
    <div style={markerOverlayStyle}>
      <div className={[styles.markerOverlay]} style={{ width, position: 'absolute', bottom: 0 }}>
        { renderUserButtons(styles, id)}
        <section className="p2">
          {detail}
        </section>
        <div className={styles.closeIcon} style={{ top: 10, position: 'relative' }}/>
      </div>
    </div>
  );
}
MapCard.propTypes = {
  width: PropTypes.number,
  detail: PropTypes.array,
  height: PropTypes.number,
  left: PropTypes.number,
  id: PropTypes.string,
  top: PropTypes.number
};
