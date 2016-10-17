/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { observable, action } from 'mobx';
export default class SnackBar {
  @observable isOpen = false;
  duration = 3000;
  message = '';
  
  init() {
    this.isOpen = false;
  }
  
  @action
  open(message) {
    this.message = message;
    this.isOpen = true;
  }
  
  @action
  close() {
    this.isOpen = false;
  }
}
