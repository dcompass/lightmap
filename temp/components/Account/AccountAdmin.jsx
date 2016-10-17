import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
const AccountAdmin = ({ appstate }) => {
  const { ui, auth, modal } = appstate;
  const { accountModal } = modal;
  return (
    <div>
      {accountModal.flagMultiUploads &&
      <UploadFilesModal
        open={accountModal.flagMultiUploads}
      />
      }
      {accountModal.flagConfirmGenerateFake &&
      <ConfirmGenerateFakeUser
        user={auth.user}
        open={accountModal.flagConfirmGenerateFake}
        progressing={accountModal.flagProgressing}
      />
      }
    </div>
  );
};
AccountAdmin.propTypes = {
  appstate: PropTypes.object.isRequired,
};
export default observer(['appstate'])(AccountAdmin);

