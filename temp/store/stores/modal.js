/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

// eslint-disable import/no-unresolved
import { observable, action, autorun } from 'mobx';
import { extend, toggle } from '~/core/decorators';
// ui classes
import accountModal from './ui/AccountModal';
const checkaccountload = ()=> {
  return new Promise(resolve => {
    require.ensure(['../../components/Account'], () => {
      resolve(require('../../components/Account'));
    });
  }, `${(process.env.NODE_ENV == 'development') ? "main" : "login"}`)
}
@extend({
  accountModal,
})
export default class Modal {
  flagFirst = true;
  @observable MyAccount = false;
  
  @action
  init() {
    // shift the layout on "su" breakpoint when appnav is open
    autorun(() => {
      if (this.flagFirst &&
        ((this.accountModal.flagSelectAccountModal ||
        this.accountModal.flagUploadBackgroundModal ||
        this.accountModal.flagUploadAvatarModal ||
        this.accountModal.flagCreateAccountModal ||
        this.accountModal.flagConfirmConcept ||
        this.accountModal.flagShowLoginModal))) {
        checkaccountload().then(action(comp=> {
          console.log("log");
          this.MyAccount = comp.default;
          this.flagFirst = false;
        }));
      }
    });
  }
}
