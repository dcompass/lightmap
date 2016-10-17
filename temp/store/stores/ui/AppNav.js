/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { observable } from 'mobx';
import { toggle } from '~/core/decorators';
@toggle('open', 'isOpen')
@toggle('dock', 'isDocked')
export default class AppNav {
  @observable isOpen = false;
  @observable isDocked = false;
}
