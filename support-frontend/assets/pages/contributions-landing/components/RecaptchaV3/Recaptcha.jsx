// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { State, AmazonPayData } from 'pages/contributions-landing/contributionsLandingReducer';
import { type Action, setAmazonPayHasAccessToken } from 'pages/contributions-landing/contributionsLandingActions';
import Button from 'components/button/button';
import { logException } from 'helpers/logger';
import AnimatedDots from 'components/spinners/animatedDots';
import { trackComponentClick, trackComponentLoad } from 'helpers/tracking/behaviour';

export const loadRecaptchaV3 = (publicKey) => {
  const recaptchaScript = document.createElement('script')
  recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${publicKey}`
  document.body.appendChild(recaptchaScript)
}
