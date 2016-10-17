/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import { observable } from 'mobx';
import { toggle } from '~/core/decorators';
@toggle('open', 'isOpen')
export default class PostCreateModal {
  @observable isOpen = false;
}
