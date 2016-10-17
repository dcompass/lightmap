import React, { PropTypes } from 'react';
import dispatch from '~/core/dispatch';
import cx from 'classnames';
import MenuLinksSX from './MenuLinksSX.jsx';
import MenuLinksDX from './MenuLinksDX.jsx';
// styles
import styles from './app.bar.css';
// events
const handleNavToggle = (e) => {
  e.preventDefault();
  dispatch('ui.appNav.open');
};
const AppBar = ({ getemail, toLeft, layoutIsShifted, isinline }) => {
  const button = cx('btn', 'inline-block', 'py2', 'm0');
  const appBar = cx('clearfix caps bold');
  return (
    <div
      className={cx(styles.bar, appBar,
        { [styles.leftShifted]: layoutIsShifted, 'left-0': !layoutIsShifted })
      }
    >
      <div className={cx({ 'left': toLeft, "right": !toLeft })}>
        <div className="inline-block">
          <div className="relative">
            <MenuLinksDX
              getemail={getemail}
              inline={isinline}
            />
          </div>
        </div>
      </div>
      <div className={cx('left', 'lg-hide')}>
        <a onClick={handleNavToggle} className={button}>
          <i className="fa fa-bars"/>
        </a>
        <MenuLinksSX inline styles/>
      </div>
      <div className={cx('left', 'lg-show')}>
        <a onClick={handleNavToggle} className={button}>
          <i className="fa fa-bars fa-2x"/>
        </a>
        <MenuLinksSX styles/>
      </div>
      
      <div className={cx('clearfix', 'sm-hide')}/>
      <div className={cx('overflow-hidden', 'px2')}/>
    </div>
  );
}
AppBar.propTypes = {
  getemail: PropTypes.any,
  layoutIsShifted: PropTypes.bool,
  isinline: PropTypes.bool,
};
export default AppBar;
