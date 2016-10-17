import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import dispatch from '~/core/dispatch';
import cx from 'classnames';
import Link from '../Linkmaterial';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
// styles
import styles from './menu.link.dx.css';
const menuAccount = cx('right-0', 'nowrap', 'rounded');
const btnBlock = cx('btn', 'block', 'py2', 'm0');
const btnInline = cx('btn', 'inline-block', 'py2', 'm0');
const preventDefault = (e)=> {
  e.preventDefault();
}
const handleMenuAccountToggle = (e) => {
  e.preventDefault();
  dispatch('ui.appBar.toggleAccountMenu');
  return false;
};
const handleAuthModalSignin = (e) => {
  dispatch('modal.accountModal.showLoginModal', true);
};
const showCreateAccountModal = (e) => {
  dispatch('auth.updateUserValue', 'usertype', 'client');
  dispatch('modal.accountModal.showCreateAccountModal', 'open');
};
const handleLogout = (e) => {
  dispatch('ui.appBar.toggleAccountMenu');
  dispatch('auth.logout').then(() => window.location.reload());
};
const handleSettings = (e)=> {
  dispatch('ui.appBar.toggleAccountMenu');
  dispatch('modal.accountModal.showCreateAccountModal', 'open');
}
const UserSubMenu = () => {
  return (
    <Menu>
      <Link
        to="Profile"
        onClick={preventDefault}
        key="1"
        hoverColor="#c2c22F"
      >
        <MenuItem leftIcon={<i className="mb3 fa fa-user"/>}>
          Profile
        </MenuItem>
      </Link>
      <MenuItem leftIcon={<i className="mb3 fa fa-sliders"/>} onTouchTap={handleSettings}>
        Settings
      </MenuItem>
      <MenuItem leftIcon={<i className="mb3 fa fa-sign-out"/>} onTouchTap={handleLogout}>
        Logout
      </MenuItem>
    </Menu>
  );
};
const MenuLinksDX = ({ getemail, inline }) => (
  <span>
    <div className={cx(styles.divider, { 'border-top': !inline })}/>
    {(getemail) &&
    <span>
        <a
          onClick={inline && handleMenuAccountToggle}
          className={inline ? btnInline : btnBlock}
        >
          {getemail} { inline && <i className="fa fa-caret-down"/> }
        </a>
        <If condition={inline}>
          <div
            className={cx(
              [styles.menuAccount, menuAccount],
              { hide: (!dispatch('ui.appBar.accountMenuIsOpen')) }
            )}
          >
            <UserSubMenu />
          </div>
          <Else />
          <div className={cx(styles.divider, { 'border-top': !inline })}/>
          <UserSubMenu />
        </If>
      </span>
    }
    {(!getemail) &&
    <span>
    <Link
      to="#"
      onTouchTap={handleAuthModalSignin}
      onClick={preventDefault}
      className={cx(styles.baseBtn, {
        [styles.baseInlineBtn]: inline,
        [styles.loginBtn]: inline,
        'inline-block': inline,
        block: !inline,
      })
      }
      key="1"
      hoverColor="#c2c222"
      icon={<i className="mb3 fa fa-sign-in"/>}>
      {window.dico.login}
    </Link>
    <Link
      to="#"
      onTouchTap={showCreateAccountModal}
      onClick={preventDefault}
      className={cx(styles.baseBtn, {
        [styles.baseInlineBtn]: inline,
        [styles.registerBtn]: inline,
        'inline-block': inline,
        block: !inline,
      })
      }
      key="2"
      icon={<i className="mb3 fa fa-sign-up"/>}>
      {window.dico.register}
      </Link>
      </span>
    }
  </span>
);
MenuLinksDX.propTypes = {
  inline: PropTypes.bool,
};
export default MenuLinksDX;
