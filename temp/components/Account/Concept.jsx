import React, { PropTypes } from 'react';
import dispatch from '~/core/dispatch';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
const dic = window.dico;
// styles
const onClose = () => dispatch('modal.accountModal.showConfirmConcept');
const ConfirmConcept = ({ open }) => {
  const actions = [
    <FlatButton
      label="Ok"
      primary={true}
      onTouchTap={onClose}
    />
  ];
  return (
    <div>
      <Dialog
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={onClose}
      >
        <h3>{dic.concept}</h3>
        <img src="/dist/moniteur.jpg"/>
      </Dialog>
    </div>
  );
}
ConfirmConcept.propTypes = {
  open: PropTypes.bool,
};
export default ConfirmConcept;
