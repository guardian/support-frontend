// @flow

import { trackComponentLoad } from './tracking/behaviour';
import { logException } from './logger';
import {
  setIsLowRiskV2,
  setIsLowRiskV3
} from '../pages/contributions-landing/contributionsLandingActions';

type RecaptchaAction = 'loaded' | 'submit';

const v3publicKey = window.guardian.v3recaptchaPublicKey;
const v2publicKey = window.guardian.v2recaptchaPublicKey;
const isRecaptchaLoaded = () => window && window.grecaptcha && typeof window.grecaptcha.execute !== 'undefined';

const postToBackend = (token: string, endpointSuffix: string): Promise<boolean> =>
  fetch(`/recaptcha${endpointSuffix}`, {
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
    return window.grecaptcha.execute(v3publicKey, { action })
      .then((token) => {
        trackComponentLoad('contributions-recaptcha-client-token-received');
        return postToBackend(token, 'v3');
      });
  }
  return Promise.reject(new Error('recaptcha not ready'));
};

const loadRecaptureV3 = () =>
  new Promise<void>((resolve, reject) => {
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${v3publicKey}`;

    recaptchaScript.onerror = reject;
    recaptchaScript.onload = resolve;

    if (document.head) {
      document.head.appendChild(recaptchaScript);
    }
  });

const loadRecaptureV2 = (dispatch: Function) =>
  new Promise<void>((resolve, reject) => {
    window.v2OnloadCallback =  () => {
      if (window.grecaptcha) {
        window.grecaptcha.render('robot_checkbox', {
          'sitekey': v2publicKey,
           callback : (token) => executeV2(token, dispatch)
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

const executeV2 = (token, dispatch: Function) => {
  postToBackend(token, 'v2')
    .then(isLowRisk => dispatch(setIsLowRiskV2(isLowRisk)));
};

const initRecaptchaV3 = (dispatch: Function) => {
  loadRecaptureV3()
    .then(() => {
      window.grecaptcha.ready(() =>
        execute('loaded')
          .then(isLowRisk => dispatch(setIsLowRiskV3(isLowRisk))));
    })
    .catch(error =>
      logException('Error loading recaptcha', error));
};

export { execute, initRecaptchaV3, loadRecaptureV2 };

