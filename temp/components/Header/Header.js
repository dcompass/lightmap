/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardMedia } from 'material-ui/Card';
import s from './Header.css';
import Link from '../Link';
import LinkM from '../Linkmaterial';
const Header = () => (
  <div className={s.container}>
    <Link className={s.brand} to="Skiscool">
      <img src="/dist/icons/logo.png" width="38" height="38" alt="React"/>
      <span className={s.brandTxt}>SkiScool</span>
    </Link>
    <div className={s.banner}>
      <h1 className={s.bannerTitle}>{window.dico.skischool}</h1>
      <p className={s.bannerDesc}>{window.dico.findinstructor}</p>
    </div>
  </div>
)
export default Header;
