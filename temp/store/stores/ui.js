/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

// eslint-disable import/no-unresolved
import { observable, action, autorun } from 'mobx';
import { extend, toggle } from '~/core/decorators';
// ui classes
import theme from './ui/Theme.js';
import appBar from './ui/AppBar.js';
import appNav from './ui/AppNav.js';
import snackBar from './ui/SnackBar.js';
import postCreateModal from './ui/PostCreateModal.js';
@extend({
  theme,
  appBar,
  appNav,
  snackBar,
  postCreateModal
})
@toggle('shiftLayout', 'layoutIsShifted')
export default class UIStore {
  @observable layoutIsShifted = false;
  @observable tooltipIsHover = [];
  hoveredTooltipcontent = '';
  breakpoints = {
    xs: '(max-width: 480px)',
    xu: '(min-width: 480px) and (max-width: 768px)',
    sm: '(min-width: 768px) and (max-width: 991px)',
    su: '(min-width: 768px)',
    md: '(min-width: 992px) and (max-width: 1199px)',
    mu: '(min-width: 1199px) and (max-width: 1400px)',
    lg: '(min-width: 1400px)',
  };
  
  init() {
    this.tooltipIsHover.length = 500;
    // shift the layout on "su" breakpoint when appnav is open
    autorun(() => ((this.breakpoints.su && this.appNav.isOpen)
      ? this.shiftLayout(false)
      : this.shiftLayout(true))
    );
    // undock the navbar if the modal is open
    /*
     autorun(() => ((this.accountModal.flagShowLoginModal)
     ? this.appNav.open(false)
     : () => false)
     );*/
    /**
     The following autoruns demonstartes how to keep
     the navbar open from the startup and how to close it
     automatically when the browser window is resized
     */
    // // open and close the nav automatically
    // // when the "xs" breakpoint changes
    // autorun(() => this.breakpoints.xs
    //   ? this.appNav.open(false)
    //   : this.appNav.open(true)
    // );
    // // dock/undock the nav automatically
    // // when the "su" breakpoint changes
    // autorun(() => this.breakpoints.su
    //   ? this.appNav.dock(true)
    //   : this.appNav.dock(false)
    // );
  }
  
  @action
  tooltipHover(key) {
    this.tooltipIsHover[key] = !this.tooltipIsHover[key];
  }
  
  @action
  hoveredTooltipApply(content) {
    this.hoveredTooltipcontent = content;
  }
}
