import React, { Component, PropTypes } from 'react';
import dispatch from '~/core/dispatch';
import IconButton from 'material-ui/IconButton';
import FontIcon from '../Material/FontIcon';
import cx from 'classnames';
const setActiveMarkerType = (state) => {
  dispatch('map.marker.setActiveMarkerType', state);
};
const setActiveResortType = (state) => {
  dispatch('map.resort.setActiveResortType', state);
};
const setShowOnlyType = (state) => {
  dispatch('map.resort.setShowOnlyType', state);
};
const setHideMarkerType = (state) => {
  dispatch('map.marker.setHideMarkerType', state);
};
function onToolbarHideMarker(e) {
  setHideMarkerType(e.currentTarget.id);
}
function onToolbarShowOnlyType(e) {
  console.log(e.currentTarget.id)
  setShowOnlyType(e.currentTarget.id);
}
function onToolbarSetResort(e) {
  setActiveResortType(e.currentTarget.id);
}
function onToolbarChangeTypeMarker(e) {
  dispatch('map.marker.setMarkerType', e.currentTarget.id);
};
const hideDownloadDialog = () => {
  dispatch('map.mapDownload.hideDownloadDialog');
};
const showDownloadDialog = (boundary) => {
  dispatch('map.mapDownload.showDownloadDialog', boundary);
};
const showDownloadMarkerDialog = (boundary) => {
  dispatch('map.mapDownload.showDownloadMarkerDialog', boundary);
};
const downloadMarkers = () => {
  let resort = dispatch('map.resort.getActiveResort');
  if (!resort)
    alert('select first one resort type');
  else
    showDownloadMarkerDialog(resort);
}
function onToolbarSetActiveMarker(e) {
  console.log(e.currentTarget.id)
  if (e.currentTarget.id === 'download') {
    let resort = dispatch('map.resort.getActiveResort');
    if (!resort)
      alert('select first one resort type');
    else
      showDownloadDialog(resort);
  } else {
    setActiveMarkerType(e.currentTarget.id);
  }
}
const SVGIconComponent = ({ icon, color }) => {
  if (icon[1].vector) {
    let typeIcon = icon[1].vector;
    if (typeIcon == "star")
      return (<div><FontIcon
          id={icon[0]}
          className={`fa fa-hotel fa-2x fa-fw`}
          color={color}
          hoverColor="#ffff00"
        /><FontIcon
          className={`fa fa-star`}
          style={{ position: 'absolute', fontSize: 10, left: 10 }}
          color={color}
          hoverColor="#ffff00"
        /><FontIcon
          className={`fa fa-star`}
          style={{ position: 'absolute', fontSize: 10, left: 20 }}
          color={color}
          hoverColor="#ffff00"
        /><FontIcon
          className={`fa fa-star`}
          style={{ position: 'absolute', fontSize: 10, left: 30 }}
          color={color}
          hoverColor="#ffff00"
        />
        </div>
      )
    else
      return (<FontIcon
        id={icon[0]}
        className={`fa fa-${typeIcon} fa-2x fa-fw`}
        color={color}
        hoverColor="#ffff00"
      />)
  } else {
    return (<div/>);
  }
}
function displayIconsSelections(icons, PropObserved) {
  return Object.entries(icons).map((icon, index) => {
    const color = PropObserved.includes(icon[0]) ? '#FFFFFF' : '#333333';
    if (icon[1].icon) {
      let MySvg = icon[1].icon;
      return (
        <IconButton
          tooltip={icon[1].label}
          id={icon[0]}
          onClick={onToolbarHideMarker}
          key={'ic' + index}
        >
          <MySvg icon={icon} color={color}/>
        </IconButton>
      )
    }
    if (icon[1].label === 'centermap' || icon[1].label === 'locationuser')
      return (<div key={'ic' + index}/>);
    else
      return (
        <IconButton
          tooltip={icon[1].label}
          id={icon[0]}
          onClick={onToolbarHideMarker}
          key={'ic' + index}
        >
          <SVGIconComponent icon={icon} color={color}/>
        </IconButton>
      )
  });
}
function displayIconsResort(icons, PropObserved) {
  return Object.entries(icons).map((icon, index) => {
    const typeIcon = icon[1].vector;
    const color = PropObserved === icon[1].label ? '#ffff00' : icon[1].color;
    return (
      <IconButton tooltip={icon[1].label} className="right" key={'iq' + index}>
        <FontIcon
          id={icon[1].label}
          className={`fa fa-${typeIcon} fa-2x fa-fw`}
          onClick={onToolbarSetResort}
          color={color}
          hoverColor="#ffff00"
        />
      </IconButton>
    )
  });
}
function displayIcons(icons, PropObserved, typeAction) {
  if (typeAction === 'selectionsMarkerType') {
    return displayIconsSelections(icons, PropObserved);
  } else if (typeAction === 'activeMarkerType') {
    return Object.entries(icons).map((icon, index) => {
      const color = PropObserved === icon[0] ? '#FFFFFF' : '#333333';
      if (icon[1].icon) {
        let MySvg = icon[1].icon;
        return (
          <IconButton
            tooltip={icon[1].label}
            id={icon[0]}
            onClick={onToolbarSetActiveMarker}
            key={'ia' + index}
          >
            <MySvg icon={icon} color={color}/>
          </IconButton>
        )
      }
      if (icon[1].label === 'centermap' || icon[1].label === 'locationuser')
        return (<div key={'ia' + index}/>);
      else
        return (
          <IconButton
            tooltip={icon[1].label}
            id={icon[0]}
            onClick={onToolbarSetActiveMarker}
            key={'ia' + index}
          >
            <SVGIconComponent icon={icon} color={color}/>
          </IconButton>
        )
    });
  } else {
    return displayIconsResort(icons, PropObserved)
  }
}
function displayIconsDialog(icons, marker) {
  console.log(marker);
  return Object.entries(icons).map((icon, index) => {
    const color = (marker.options.item.type == icon[0]) ? '#222' : '#555';
    const disabled = (marker.options.item.type == icon[0]);
    if (icon[1].icon && icon[1].label !== 'Download') {
      let MySvg = icon[1].icon;
      return (
        <IconButton
          disabled={disabled}
          tooltip={icon[1].label}
          id={icon[0]}
          onClick={onToolbarChangeTypeMarker}
          key={'i' + index}
        >
          <MySvg icon={icon} color={color}/>
        </IconButton>
      )
    }
    if (icon[1].label === 'centermap' || icon[1].label === 'locationuser' || icon[1].label === 'Download')
      return (<div key={'ic' + index}/>);
    else
      return (
        <IconButton
          disabled={disabled}
          tooltip={icon[1].label}
          id={icon[0]}
          onClick={onToolbarChangeTypeMarker}
          key={'i' + index}
        >
          <SVGIconComponent icon={icon} color={color}/>
        </IconButton>
      )
  });
}
function onClose() {
  dispatch('map.closeOverlay');
}
const renderUserButtons = (styles, id) => {
  return (
    <FontIcon
      className="red p2 right fa fa-2x fa-close"
      onClick={onClose}
      hoverColor="#ffff00"
    />
  )
};
const renderAdminButtons = (icons, marker, styles, id, open) => {
  const removeActiveMarker = (e, type) => {
    dispatch('map.marker.remove', e, type);
  };
  const removeActiveRectangle = (e) => {
    dispatch('map.resort.remove', e);
  }
  
  function onRemove(e) {
    if (e.currentTarget.id === 'markers' || e.currentTarget.id === 'googleMarkers') {
      removeActiveMarker(e, e.currentTarget.id);
    } else if (e.currentTarget.id === 'rectangle') {
      removeActiveRectangle(e);
    }
    onClose();
  }
  
  function onDetail(e) {
    dispatch('map.showMapOverlayAdmin2');
  }
  
  function onSaveDetail(e) {
    dispatch('map.saveDetail', marker);
  }
  
  return (
    <div className="flex flex-column"
         style={{ zIndex: 6, width: 30, position: 'absolute', right: -20, backgroundColor: 'beige' }}>
      <FontIcon
        className="red p2 right fa fa-2x fa-close"
        onClick={onClose}
        hoverColor="#ffff00"
      />
      <FontIcon
        className="blue p2 right fa fa-2x fa-trash-o"
        id={id}
        onClick={onRemove}
        hoverColor="#ffff00"
      />
      {(id !== 'rectangle') &&
      <div>
        <FontIcon
          className="p2 right fa fa-2x fa-bars"
          onClick={onDetail}
          hoverColor="#ffff00"
        />
        <FontIcon
          className="p2 right fa fa-2x fa-save"
          onClick={onSaveDetail}
          hoverColor="#ffff00"
        />
        <div className={cx({ "hide": !open }, "right flex flex-column")}
             style={{ zIndex: 6, position: 'absolute', right: -90, backgroundColor: 'black' }}>
          {displayIconsDialog(icons, marker)}
        </div>
      </div>}
    </div>)
};
export {
  SVGIconComponent,
  renderAdminButtons,
  renderUserButtons,
  displayIcons,
  displayIconsResort,
  displayIconsSelections,
  downloadMarkers,
  hideDownloadDialog
}