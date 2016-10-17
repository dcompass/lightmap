import React, { PropTypes } from 'react';
import cx from 'classnames';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import dispatch from '~/core/dispatch';
const dialogStyle = {
  width: '30%',
  maxWidth: 'none',
};
const updateBoundaryValue = (e) => {
  dispatch('map.mapDownload.updateBoundaryValue', e.target.name, e.target.value);
}
export const DialogDownloadMap = ({ onClose, mapBoundary }) => {
  const { _northEast, _southWest, name, todownload, type, boundaryRects } = mapBoundary;
  const downloadTiles = () => {
    dispatch('map.mapDownload.download');
    onClose();
  };
  const downloadMarkers = () => {
    dispatch('map.mapDownload.downloadMarkers');
    onClose();
  };
  const defineBoundary = () => {
    alert("not implemented")
    onClose();
  };
  let titleButton = todownload ? 'Start Download' : 'Define Boundary';
  if (type === 'markers') {
    titleButton = 'Download Markers';
  }
  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={onClose}
    />,
    <FlatButton
      label={titleButton}
      primary={true}
      onTouchTap={type === 'markers' ? downloadMarkers : ((todownload) ? downloadTiles : defineBoundary)}
    />,
  ];
  return (
    <Dialog
      title={`Download map ${type === 'markers' ? 'markers' : 'tiles'}...`}
      modal={false}
      open={true}
      actions={actions}
      onRequestClose={onClose}
      contentStyle={dialogStyle}
    >
      <div className={cx('center', 'm3')}>
        <div className={cx('inline-block', 'clearfix')}>
          <TextField
            name="name"
            floatingLabelText={'Boundary Name'}
            onChange={updateBoundaryValue}
            value={name}
          />
          {type === 'markers' &&
          <div>
            name : {name} <br/>
            number of boundary to fetch : {boundaryRects.length}
          </div>
          }
          {type === 'tiles' &&
          <div>
            <TextField
              name="northEast"
              floatingLabelText={'North East Position'}
              onChange={updateBoundaryValue}
              value={`${_northEast[0]} , ${_northEast[1]}`}
            />
            <TextField
              name="southWest"
              floatingLabelText={'South West Position'}
              onChange={updateBoundaryValue}
              value={`${_southWest[0]} , ${_southWest[1]}`}
            />
            <Checkbox
              style={{ width: '256px', textAlign: 'left', display: 'inline-block' }}
              name="todownload"
              onCheck={updateBoundaryValue}
              checked={todownload}
              label="Download tiles"
            />
          </div>
          }
        </div>
      </div>
    </Dialog>
  );
};
DialogDownloadMap.propTypes = {
  onClose: PropTypes.func,
  mapBoundary: PropTypes.object
};
