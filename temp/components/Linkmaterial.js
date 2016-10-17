/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import history from '../core/history';
import { matchURI } from '~/utils/utils';
const Paddingdef = '5';
const Margindef = '0';
class Link extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    topath: PropTypes.string,
    onClick: PropTypes.func,
    onTouchTap: PropTypes.func,
    marginTop: PropTypes.string,
    params: PropTypes.object,
    marginBottom: PropTypes.string,
    padding: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string,
    flagRoute: PropTypes.bool,
    history: PropTypes.bool,
    Mystyle: PropTypes.object,
  };
  static defaultProps = {
    flagRoute: true,
    history: true
  }
  
  constructor(props) {
    super(props);
    let tooo = this.props.to;
    const prefix = props.flagRoute ? './routes' : '';
    if (tooo == '/' || tooo == '#')
      tooo = 'Skiscool';
    if (!props.flagRoute) {
      this.toward = tooo;
    } else {
      if (this.props.to) {
        let path = this.props.to;
        this.toward = '/';
        const route = window.__routes__.find(
          x => (
            x.component ? x.component === `${prefix}/${tooo}` : null
          ));
        if (route && route.path) {
          let path = route.path;
          const comp = route.component.replace('./routes/', '');
          if (comp !== 'Profile') {
            let regex = new RegExp('\/:id\\?', 'g');
            path = path.replace(regex, '');
            regex = new RegExp('\/:ie\\?', 'g');
            path = path.replace(regex, '');
          }
          this.toward = path;
          if (props.params) {
            if (comp === 'Clothes' || comp === 'Map') {
              if (props.params.id) {
                this.toward += '/' + props.params.id;
              }
              if (props.params.ie) {
                this.toward += '/' + props.params.ie;
              }
            }
          }
        } else {
          console.log('link fail:');
          console.log(`./routes/${tooo}`);
        }
      } else if (this.props.topath) {
        let params, path;
        let topath = this.props.topath.split("/");
        topath[1] = topath[1] + '_' + window.__lang__;
        topath = topath.join("/");
        const route = window.__routes__.find(x =>((params = matchURI(x, this.props.topath)) || (params = matchURI(x, topath))) ? true : false);
        if (route) {
          path = route.path;
          const comp = route.component.replace('./routes/', '');
          // if (comp !== 'Profile') {
          let regex = new RegExp('\/:id\\?', 'g');
          path = path.replace(regex, '');
          regex = new RegExp('\/:ie\\?', 'g');
          path = path.replace(regex, '');
          this.toward = path;
          /* } else {
           this.toward = path;
           }*/
          if (params && params.id) {
            // console.log(params.id);
            this.toward += '/' + params.id;
          }
          if (params && params.ie) {
            // console.log(params.id);
            this.toward += '/' + params.ie;
          }
        } else {
          console.log('link fail:');
          console.log(this.props.topath);
        }
      }
    }
  }
  
  Mystyle = () => {
    if (this.props.Mystyle)
      return { ...this.props.Mystyle };
    else
      return {
        marginTop: `${((this.props.marginTop) ? this.props.marginTop : Margindef)}px`,
        marginBottom: `${((this.props.marginBottom) ? this.props.marginBottom : Margindef)}px`,
        padding: `${((this.props.padding) ? this.props.padding : Paddingdef)}px`,
        height: 'auto',
        width: ((this.props.width) ? this.props.width : 'auto'),
      }
  };
  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };
  handleTouchTap = (event) => {
    if (event.button && event.button !== 0) {
      return;
    }
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    if (event.defaultPrevented === true) {
      return;
    }
    if (this.toward && this.props.history) {
      history.push(this.toward);
    } else {
      if (this.props.history)
        history.push({
          pathname: event.currentTarget.pathname,
          search: event.currentTarget.search,
        });
    }
    if (this.props.onTouchTap) {
      this.props.onTouchTap(event);
    }
  };
  
  render() {
    const myprops = Object.assign({}, this.props);
    let toward;
    let style = this.Mystyle();
    delete myprops.marginTop;
    delete myprops.marginBottom;
    delete myprops.padding;
    delete myprops.onClick;
    delete myprops.topath;
    delete myprops.flagRoute;
    delete myprops.history;
    delete myprops.Mystyle;
    delete myprops.desktop;
    delete myprops.focusState;
    delete myprops.params;
    if (!this.toward) {
      toward = '';
    } else toward = this.toward;
    return (<FlatButton
      href={(this.props.history) ? history.createHref(toward) : toward}
      {...myprops}
      onClick={this.handleClick}
      onTouchTap={this.handleTouchTap}
      style={style}
    />);
  }
}
export default Link;
