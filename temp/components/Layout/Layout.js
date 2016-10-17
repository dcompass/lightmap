/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { PropTypes } from 'react';
import Divider from 'material-ui/Divider';
import Header from './Header';
import dispatch from '~/core/dispatch';
import cx from 'classnames';
import Link from '../Linkmaterial';
import styles from './stylehead.css';
const OpenModal = (e) => {
  dispatch('modal.accountModal.showConfirmConcept');
  e.preventDefault();
}
/*
 function statelessWrapper(props) {
 return createFragment({
 right: props.children
 });
 }*/
const Layout = ({ comp, subtitle, title, ...props }) => {
  let propsadded = {};
  if (comp === "Skiscool") {
    //  styles.xsTitle = { ...styles.xsmainTitle, ...styles.wmaintitle };
    // styles.suTitle = { ...styles.sumainTitle, ...styles.wmaintitle };
    styles.xsTitle = styles.xsmainTitle;
  }
  const h1ClassName = cx(styles.title, styles.xsTitle);
  if (props.long) {
    propsadded = { id: props.lat, ie: props.long };
    delete props.long;
    delete props.lat;
  }
  if (props.genre) {
    propsadded = { id: props.genre, ie: props.name };
    delete props.genre;
    delete props.name;
  }
  if (props.nameMap) {
    propsadded = { id: props.nameMap };
    delete props.nameMap;
  }
  if (props.name) {
    propsadded = { id: props.name };
    delete props.name;
  }
  return (<div>
    <Header
      title={title}
      comp={comp}
      subtitle={subtitle}
      propsadded={propsadded}
    />
    <Divider />
    {(comp === "Skiscool") &&
    <h1 className={h1ClassName}>
      <Link
        to={comp}
        primary
        hoverColor="#ef6091"
        icon={<i
          className="left mb2 pr2 fa fa-eye"
        />}
        onClick={OpenModal}
        style={{ backgroundColor: 'white', color: '#337ab7' }}>{title}</Link>
    </h1>
    }
    <main {...props} className="regular mx-auto"/>
  </div>);
};
Layout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  comp: PropTypes.string.isRequired
};
export default Layout;
