import cx from 'classnames';
import dispatch from '~/core/dispatch';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
// styles
import s from './styles.css';
const preventdefault = (e) => {
  e.preventDefault();
}
const handleCloseModal = () =>
  dispatch('modal.accountModal.showSelectAccountModal');
const storeUserTypeAndRedirect = (usertype) => {
  dispatch('auth.updateUserValue', 'usertype', usertype);
  dispatch('modal.accountModal.showSelectAccountModal');
  dispatch('modal.accountModal.showCreateAccountModal');
  //we change the usertype in store before to go to facebook to pass the info to the next dialog that we are instructor
  return true;
};
const actions = [
  <FlatButton
    label="Cancel"
    primary={true}
    onTouchTap={handleCloseModal}
  />
];
const SelectAccountModal = ({ open, close }) => (
  <Dialog
    title="Select User type"
    modal={false}
    actions={actions}
    open={open}
    autoScrollBodyContent={true}
    style={{ Height: 500 }}
    onRequestClose={handleCloseModal}
  >
    <div className="center">
      <div className="flex flex-column block clearfix">
        <FlatButton
          label="Ski Client"
          id="client"
          style={{ minHeight: 200 }}
          labelStyle={{ display: 'block' }}
          icon={<img src="/dist/pictures/client.jpg" height="150"/>}
          primary={true}
          onTouchTap={() => storeUserTypeAndRedirect('client')}
          onClick={preventdefault}
        />
        <FlatButton
          label="Instructor"
          id="instructor"
          style={{ minHeight: 200 }}
          labelStyle={{ display: 'block' }}
          icon={<img src="/dist/pictures/instructor.jpg" height="150"/>}
          primary
          onTouchTap={() => storeUserTypeAndRedirect('instructor')}
          onClick={preventdefault}
        />
      </div>
    </div>
  </Dialog>
);
SelectAccountModal.propTypes = {
  open: React.PropTypes.bool,
};
export default SelectAccountModal;
