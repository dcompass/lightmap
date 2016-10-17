/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import cx from 'classnames';
import dispatch from '~/core/dispatch';
import history from '~/core/history';
import Navigation2 from './Navigation';
import styles from './stylehead.css';
import Link from '../Linkmaterial';
const Header = ({ appstate, subtitle, title, comp, propsadded }) => {
  let nomain, hClassName, h2ClassName, h1ClassName, classmenu, hStyle;
  const { resorts, constant } =  appstate.auth;
  const ui = appstate.ui;
  const bp = ui.breakpoints;
  let ismobile = false;
  if (/Mobi/.test(window.navigator.userAgent)) {
    // mobile!
    ismobile = true;
  }
  if (comp === "Skiscool") {
    const blsm = (!ismobile && bp.sm);
    const blxu = (!ismobile && bp.xu);
    const blxs = (!ismobile && bp.xs);
    const blmd = (ismobile || bp.md);
    hClassName = cx(styles.header, {
      [styles.xsback]: blxs,
      [styles.xuback]: blxu,
      [styles.smback]: blsm,
      [styles.mdback]: blmd,
      [styles.muback]: bp.mu,
      [styles.lgback]: bp.lg,
    }, 'bg-cover relative');
    if (bp.lg)
      hStyle = { minHeight: 800 };
    else if (bp.md || bp.mu || bp.sm)
      hStyle = { minHeight: 600 };
    else if (bp.xu)
      hStyle = { minHeight: 380 };
    else
      hStyle = { minHeight: 320 };
    classmenu = cx({ 'background-color': 'rgba(249, 25, 126, 0.31)' }, "absolute bottom-0 black");
    styles.xsTitle = styles.xsmainTitle;
    styles.suTitle = styles.sumainTitle;
    h2ClassName = cx(styles.subTitle, {
      [styles.xsmainSubTitle]: bp.xs,
      [styles.sumainSubTitle]: !bp.xs,
    });
  } else {
    hStyle = {};
    nomain = true;
    classmenu = '';
    hClassName = cx(styles.header);
    h2ClassName = cx(styles.subTitle, {
      [styles.xsSubTitle]: bp.xs,
      [styles.suSubTitle]: !bp.xs,
    });
    h1ClassName = cx(styles.title, styles.xsTitle, styles.wtitle);
  }
  let subtitletp = '';
  subtitle.split('').forEach(function (c) {
    if (c == ' ')
      subtitletp += '\u00a0 ';
    else
      subtitletp += c + ' ';
  });
  return (
    <header className={hClassName} style={hStyle}>
      <div className={styles.container}>
        <div className={styles.title}>
          {nomain && <h1 className={h1ClassName}><Link to={comp} params={propsadded}>{title}</Link></h1>
          }
          <h2 className={h2ClassName}>{subtitletp}</h2>
        </div>
      </div>
      <Navigation2 myClass={classmenu}/>
    </header>
  );
};
Header.propTypes = {
  appstate: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  propsadded: PropTypes.object,
  comp: PropTypes.string.isRequired
};
export default observer(['appstate'])(Header);
//export default Header;
