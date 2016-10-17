import cx from 'classnames';
import React from 'react';
import dispatch from '~/core/dispatch';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AuthFormRegister from './Register/Register';
import history from '../../core/history';
// styles
const buttonGroup = cx('btn', 'left', 'x-group-item');
const authSection = cx('center', 'fit', 'col-8', 'px2', 'mb3', 'mx-auto');
const handleCloseModal = () =>
  dispatch('modal.accountModal.showCreateAccountModal');
const preventdefault = (e) => {
  e.preventDefault();
};
const updateUserType = (e) => {
  console.log(e.currentTarget.id)
  dispatch('auth.updateUserValue', 'usertype', e.currentTarget.id);
}
const CreateAccountModal = ({ open, user }) => {
  const usertype = user.usertype;
  const instructorButtonProps = user.facebook ? {
    onTouchTap: updateUserType,
    onClick: preventdefault,
  } : {
    href: history.createHref('/auth/facebook'),
  };
  return (
    <Dialog
      title="Create Account"
      modal={false}
      open={open}
      onRequestClose={handleCloseModal}
      autoScrollBodyContent={true}
    >
      <div className="center">
        <div className='inline-block clearfix m2'>
          {
            <FlatButton
              {...instructorButtonProps}
              label="Instructor"
              backgroundColor={cx({
                '#a4c639': usertype === 'instructor'
              })}
              hoverColor="#0A50cF"
              id="instructor"
              icon={<img src="/dist/pictures/icon_ski_trainer.png"/>}
              primary={usertype === 'instructor'}
              style={{ color: 'black', padding: 4, height: 50 }}
              className="left"
            />
          }
          { !user.instructorInfo &&
          <FlatButton
            label="Ski Client"
            id="client"
            icon={<img src="/dist/pictures/icon_ski_client.png"/>}
            primary={usertype === 'client'}
            onTouchTap={updateUserType}
            onClick={preventdefault}
            hoverColor="#0A50cF"
            style={{ color: 'black', padding: 4, height: 50 }}
            backgroundColor={cx({
              '#a4c639': usertype === 'client'
            })}
          />
          }
        </div>
      </div>
      
      <div className={cx(authSection)}>
        <AuthFormRegister />
      </div>
    </Dialog>
  );
};
CreateAccountModal.propTypes = {
  open: React.PropTypes.bool,
};
export default CreateAccountModal;
