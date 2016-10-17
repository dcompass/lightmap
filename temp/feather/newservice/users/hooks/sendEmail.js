/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

/**
 * Created by BaeBae on 9/12/16.
 */
import crypto from 'crypto';
import cryptoJS from 'crypto-js';
import sha512 from 'crypto-js/sha512';
export default function sendEmail() {
  return (hook) => {
    if (!hook.facebook && hook.data.email && !hook.data.fake) {
      const salt = crypto.randomBytes(48).toString('base64');
      hook.data.createToken = sha512(salt + hook.data.email).toString(cryptoJS.enc.Base64);
      const verifyLink = `http://${hook.app.get('host')}:${hook.app.get('port')}/verifyToken?token=${hook.data.createToken}`;
      const message = {
        from: hook.app.get('mailgun').sender,
        to: hook.data.email,
        subject: 'Please verify your account',
        html: `Try to follow the given link to complete signup process. <br/><a href="${verifyLink}">${verifyLink}</a>`,
      };
      hook.app.service('mailer').create(message).then(
        (result) => {
          console.log('email result: ', result);
        }
      )
        .catch(
          (err) => {
            console.log('email error: ', err);
          }
        );
    }
    return hook;
  };
}
