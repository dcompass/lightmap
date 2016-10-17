import cx from 'classnames';
import dispatch from '~/core/dispatch';
import Dialog from 'material-ui/Dialog';
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Login from './Login';
const buttonGroup = cx('btn', 'left', 'x-group-item');
const authSection = cx('center', 'fit', 'col-8', 'px2', 'mb3', 'mx-auto');
const handleCloseModal = () =>
  dispatch('modal.accountModal.showLoginModal', 'close');
const handleShowSignupSection = () => {
  dispatch('modal.accountModal.showLoginModal', 'close');
  dispatch('modal.accountModal.showSelectAccountModal', 'open');
}
const LoginModal = ({ open, showSection }) => (
  <Dialog
    title="Register / Login"
    modal={false}
    open={open}
    onRequestClose={handleCloseModal}
  >
    <div className={cx('center', 'm3')}>
      <div className={cx('inline-block', 'clearfix')}>
        <FlatButton
          label="Login"
          primary
          keyboardFocused
          className={cx(buttonGroup, 'rounded-left', {
            'btn-primary': showSection === 'signin',
            'btn-outline': showSection !== 'signin',
          })}
        />
        <FlatButton
          label="Register"
          primary={false}
          className={cx(buttonGroup, 'rounded-right', {
            'btn-primary': showSection === 'signup',
            'btn-outline': showSection !== 'signup',
          })}
          onClick={handleShowSignupSection}
        />
      </div>
    </div>
    <div className={cx(authSection)}>
      <h3>Login</h3>
      <Login />
    </div>
  </Dialog>
);
LoginModal.propTypes = {
  open: React.PropTypes.bool,
  showSection: React.PropTypes.string,
};
export default LoginModal;
