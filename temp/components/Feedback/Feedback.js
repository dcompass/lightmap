/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React from 'react';
import styles from './Feedback.css';
import { str_rot13 } from '~/utils/utils';
class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.mail = str_rot13('mailto:simon@skiscool.com');
    this.question = `${this.mail}?subject=question`;
    this.contact = `${this.mail}?subject=contact`;
  }
  
  componentDidMount() {
    const mail = document.getElementsByClassName(`${styles.link}`);
    console.log(mail)
    if (mail && mail[0]) {
      Array.prototype.forEach.call(mail, (mail)=> {
        const href = mail.href;
        mail.href = str_rot13(href.substr(0, this.mail.length)) + href.substr(this.mail.length);
      });
    }
  };
  
  render() {
    const dic = window.dico;
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <a
            className={styles.link}
            href={this.question}
          >{dic.question}</a>
          <span className={styles.spacer}>|</span>
          <a
            className={styles.link}
            href={this.contact}
          >{dic.contact}</a>
        </div>
      </div>
    );
  }
}
export default Feedback;
