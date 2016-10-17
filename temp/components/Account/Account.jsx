import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import LoginModal from './LoginModal';
import CreateAccountModal from './CreateAccountModal';
import SelectAccountModal from './SelectAccountModal';
import ConfirmConcept from './Concept';
const Account = ({ appstate }) => {
  const { ui, auth, modal } = appstate;
  const { accountModal } = modal;
  return (
    <div>
      {accountModal.flagShowLoginModal &&
      <LoginModal
        open={accountModal.flagShowLoginModal}
      />
      }
      {accountModal.flagCreateAccountModal &&
      <CreateAccountModal
        open={accountModal.flagCreateAccountModal}
        user={auth.user}
      />
      }
      {accountModal.flagSelectAccountModal &&
      <SelectAccountModal
        open={accountModal.flagSelectAccountModal}
      />
      }
      {accountModal.flagConfirmConcept &&
      <ConfirmConcept
        open={accountModal.flagConfirmConcept}
      />
      }
    </div>
  );
};
Account.propTypes = {
  appstate: PropTypes.object.isRequired,
};
export default observer(['appstate'])(Account);

