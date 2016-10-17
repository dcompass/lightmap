/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { PropTypes, Component } from 'react';
import history from '../../core/history';
import s from './Link.css';
import { matchURI } from '~/utils/utils';
class Link extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onClick: PropTypes.func,
  };
  
  constructor(props) {
    super(props);
    this.toward = '/';
    this.comp_href = './routes/Skiscool';
  }
  
  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    if (event.button !== 0 /* left click */) {
      return;
    }
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    if (event.defaultPrevented === true) {
      return;
    }
    event.preventDefault();
    const { pathname, search } = event.currentTarget;
    if (this.toward) {
      history.push(this.toward);
    } else {
      history.push({ pathname, search });
    }
  };
  
  render() {
    // find the component, if not found return in console the link with a problem
    let too = this.props.to;
    const route = window.__routes__.find(x =>
      (x.component ? x.component === `./routes/${too}` : null));
    if (route && route.path) {
      let path = route.path;
      const comp = route.component.replace('./routes/', '');
      if (comp === 'Clothes' || comp === 'Map') {
        let regex = new RegExp('\/:id\\?', 'g');
        path = path.replace(regex, '');
        regex = new RegExp('\/:ie\\?', 'g');
        path = path.replace(regex, '');
      }
      this.toward = path;
      this.comp_href = route.component;
    } else {
      console.log('link fail:');
      console.log(`./routes/${too}`);
    }
    // compare this link with the actual one to create the highlight style
    let getComp = '0';
    let pathname = history.getCurrentLocation().pathname;
    const path = decodeURI(pathname);
    let params;
    const routev = window.__routes__.find(x =>((params = matchURI(x, path)) ? true : false));
    let addclassmain = '';
    if (routev) {
      getComp = routev.component;
      if (routev.path === "/")
        addclassmain = s.back;
    }
    const linkClass = (comp, comp1) => (
      comp === comp1 ? `${s.link} ${s.highlight} ${addclassmain}` : `${s.link} ${addclassmain}`
    );
    const out = linkClass(getComp, this.comp_href);
    ///
    return (
      <a
        href={history.createHref(this.toward)}
        className={out}
        {...this.props}
        onClick={this.handleClick}
      />
    );
  }
}
export default Link;
