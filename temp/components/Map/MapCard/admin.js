/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import dispatch from '~/core/dispatch';
import styles from './style.css';
import { renderAdminButtons } from '../ToolBarUtils';
const updateField = (e) => {
  dispatch('map.updateFieldDetails', e.target.name, e.target.value);
};
export const MapCard = ({ statemarker, left, top, detail, width, height, id, open }) => {
  const icons = statemarker.icons;
  const marker = statemarker.activeMarker;
  const markerOverlayStyle = {
    position: 'absolute',
    top: top - height - 40,
    left: left - (width / 2) - 12.5,
    width,
    height,
  };
  return (
    <div style={markerOverlayStyle}>
      <div className={[styles.markerOverlay]} style={{ width, position: 'absolute', bottom: 0, minHeight: 100 }}>
        {(marker || (id === 'rectangle')) &&
        renderAdminButtons(icons, marker, styles, id, open)}
        {(id !== 'rectangle') &&
        <section className="p2">
          <TextField
            className="h2"
            name="Name"
            floatingLabelText="Name"
            value={detail.Name}
            onChange={updateField}
            key="nm"
          />
          <TextField
            className="h2"
            name="Site"
            floatingLabelText="website"
            value={detail.Site}
            onChange={updateField}
            key="wb"
          />
          <TextField
            className="h2"
            name="Number"
            floatingLabelText="Number"
            value={detail.Number}
            onChange={updateField}
            key="ef"
          />
          <TextField
            className="h2"
            name="Adress"
            floatingLabelText="Adress"
            value={detail.Adress}
            multiLine={true}
            rows={10}
            onChange={updateField}
            key="s"
          />
        </section>
        }
        <div className={styles.closeIcon} style={{ top: 10, position: 'relative' }}/>
      </div>
    </div>
  );
}
MapCard.propTypes = {
  width: PropTypes.number,
  detail: PropTypes.object,
  height: PropTypes.number,
  left: PropTypes.number,
  id: PropTypes.string,
  top: PropTypes.number
};
