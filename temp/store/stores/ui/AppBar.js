/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

// eslint-disable import/no-unresolved
import { observable } from 'mobx';
import { toggle } from '~/core/decorators';
@toggle('toggleAccountMenu', 'accountMenuIsOpen')
export default class AppBar {
  @observable accountMenuIsOpen = false;
}
