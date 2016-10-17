/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import dispatch from '~/core/dispatch';
import DisplayMap from '~/components/Map/displayMap';
@observer(['appstate'])
class MapPage extends Component {
  static propTypes = {
    appstate: PropTypes.object.isRequired,
    lang: PropTypes.string,
    title: PropTypes.string,
    lat: PropTypes.string,
    nameMap: PropTypes.string,
    long: PropTypes.string,
    description: PropTypes.string,
  };
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
    setMeta: PropTypes.func,
    muiTheme: PropTypes.object.isRequired,
  };
  
  componentWillMount() {
    if ((!this.props.lat) || (!this.props.long)) {
      this.lng = '0';
      this.lat = '0';
    } else {
      this.lng = this.props.long;
      this.lat = this.props.lat;
      if (isNaN(parseFloat(this.lat)) || isNaN(parseFloat(this.lng))) {
        this.lng = '0';
        this.lat = '0';
      }
    }
    if (this.props.nameMap) {
      dispatch('auth.constant.getBoundary', this.props.nameMap).then(boundaries=> {
        this.location = dispatch('auth.constant.getLatLngfromName', this.props.nameMap);
        this.lng = `${this.location.lng}`;
        this.lat = `${this.location.lat}`;
        dispatch('auth.constant.setreloadMap');
      });
    }
  }
  
  constructor(props) {
    super(props);
    // this.addItem = this.addItem.bind(this);
    // console.log(typeof window === 'object' ? 'client-side' : 'server-side');
  }
  
  render() {
    // eslint-disable-next-line no-unused-vars
    const { appstate, lang, description, title, nameMap } = this.props;
    const { constant } = appstate.auth;
    const reloadMap = constant.reloadMap;
    this.context.setMeta('description', description);
    this.context.setTitle(title);
    return (
      <DisplayMap Map={constant.MapRequire} reloadMap={reloadMap} lat={this.lat} lng={this.lng}/>
    )
  }
}
export default MapPage;
// Root.contextTypes = { setTitle: PropTypes.func.isRequired };
