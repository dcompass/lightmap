/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './style.css';
import Link from '../Linkmaterial';
import { observer } from 'mobx-react';
import dispatch from '~/core/dispatch';
// eslint-disable-next-line no-unused-vars
const preventDefault = (e)=> {
  e.preventDefault();
}
const Navigation = ({ className }) => {
  return (
    <div
      className={cx(styles.root)}
      role="navigation"
    >
      <Link
        primary
        hoverColor="#ef6091"
        icon={<i
          className="mb3 fa fa-map-signs"
        />}
        onClick={preventDefault}
        className={cx(styles.link, className)}
        to="Map"
      >Map</Link>
      <Link
        secondary
        hoverColor="#5BC0BE"
        icon={<i
          className="mb3 fa fa-magic"
        />}
        onClick={preventDefault}
        className={cx(styles.link, className)}
        to="Instructors"
      >Instructors</Link>
      {(dispatch('auth.isConnected')) &&
      <Link
        className={cx(styles.link, className)}
        to="Profile"
        onClick={preventDefault}
      >profile</Link>
      }
    </div>
  )
};
Navigation.propTypes = {
  className: PropTypes.string,
};
export default Navigation;
