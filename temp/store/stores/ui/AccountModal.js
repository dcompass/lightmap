/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { observable, action, computed } from 'mobx';
import { toggle } from '~/core/decorators';
@toggle('showCreateAccountModal', 'flagCreateAccountModal')
@toggle('showSelectAccountModal', 'flagSelectAccountModal')
@toggle('showLoginModal', 'flagShowLoginModal')
@toggle('showConfirmConcept', 'flagConfirmConcept')
@toggle('updateProgressing', 'flagProgressing')
export default class AccountModal {
  @observable flagSelectAccountModal = false;
  @observable flagCreateAccountModal = false;
  @observable flagShowLoginModal = false;
  @observable flagConfirmConcept = false;
  @observable flagProgressing = false;
  currentCardKey = false;
  
  setUserIndex(key) {
    this.currentCardKey = key;
  }
}
