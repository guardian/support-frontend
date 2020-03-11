// @flow

import { trackComponentLoad } from './tracking/behaviour';
import { logException } from './logger';
import { setIsLowRisk } from '../pages/contributions-landing/contributionsLandingActions';

type RecaptchaAction = 'loaded' | 'submit';

const publicKey = window.guardian.recaptchaPublicKey;
const isRecaptchaLoaded = () => window && window.grecaptcha && typeof window.grecaptcha.execute !== 'undefined';

const postToBackend = (token: string): Promise<boolean> =>
  fetch('/recaptcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
    }),
  }).then(response => response.json())
    .then(data => data.isLowRisk);

const execute = (action: RecaptchaAction) => {
  if (isRecaptchaLoaded()) {
    return window.grecaptcha.execute(publicKey, { action })
      .then((token) => {
        trackComponentLoad('contributions-recaptcha-client-token-received');
        return postToBackend(token);
      });
  }
  return Promise.reject(new Error('recaptcha not ready'));
};

const loadRecaptureV3 = () =>
  new Promise<void>((resolve, reject) => {
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${publicKey}`;

    recaptchaScript.onerror = reject;
    recaptchaScript.onload = resolve;

    if (document.head) {
      document.head.appendChild(recaptchaScript);
    }
  });

const loadRecaptureV2 = () =>
  new Promise<void>((resolve, reject) => {
    window.v2OnloadCallback =  () => {
      console.log("v2callback");
      if (window.grecaptcha) {
        window.grecaptcha.render('robot_checkbox', {
          'sitekey': ''
        });
      }
    };
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = `https://www.google.com/recaptcha/api.js?onload=v2OnloadCallback&render=explicit`;

    recaptchaScript.onerror = reject;
    recaptchaScript.onload = resolve;

    if (document.head) {
      document.head.appendChild(recaptchaScript);
    }
  });

const initRecaptchaV3 = (dispatch: Function) => {
  loadRecaptureV3()
    .then(() => {
      window.grecaptcha.ready(() =>
        execute('loaded')
          .then(isLowRisk => dispatch(setIsLowRisk(isLowRisk))));
    })
    .catch(error =>
      logException('Error loading recaptcha', error));
};

export { execute, initRecaptchaV3, loadRecaptureV2 };

