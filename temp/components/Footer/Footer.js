/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React from 'react';
import styles from './Footer.css';
import Link from '../Link';
import Divider from 'material-ui/Divider';
const Footer = () => {
  const dic = window.dico;
  return (
    <div className={styles.root}>
      <div className={`p3 ${styles.container}`}>
        <div className="clearfix mb4">
          {dic.footertext}
        </div>
        
        <Divider />
        
        <div className="mt2 p1 clearfix center">
          <span className={styles.text}>© SkiScool</span>
          <span className={styles.spacer}>·</span>
          <Link className={styles.link} to="Skiscool">Home</Link>
          <span className={styles.spacer}>·</span>
          <Link className={styles.link} to="Map">Map</Link>
          <span className={styles.spacer}>·</span>
          <Link className={styles.link} to="Privacy">Privacy</Link>
          <span className={styles.spacer}>·</span>
          <Link className={styles.link} to="Terms">Terms</Link>
        </div>
      </div>
      <div className="hide" dangerouslySetInnerHTML={{ __html: dic.footerlink }}/>
    </div>
  )
}
export default Footer;
