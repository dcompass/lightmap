/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { useStrict } from 'mobx';
import store from './store';
import UIStore from './stores/ui';
import ModalStore from './stores/modal';
import AppStore from './stores/app';
import AuthStore from './stores/auth';
import MapStore from './stores/map';
// import PostStore from './stores/post';
/**
 Enables MobX strict mode globally.
 In strict mode, it is not allowed to
 change any state outside of an action
 */
useStrict(true);
const $store = new store();
/**
 Stores
 */
export default $store
  .setup({
    modal: ModalStore,
    ui: UIStore,
    app: AppStore,
    auth: AuthStore,
    map: MapStore
    //  post: PostStore,
  });
