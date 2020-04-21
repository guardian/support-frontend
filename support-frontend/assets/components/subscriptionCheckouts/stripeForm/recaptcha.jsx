// @flow

import React from 'react';
import { withError } from 'hocs/withError';


const Recaptcha = props =>
  (<div
    className="robot_checkbox"
    {...props}
  />);

const RecaptchaWithError = withError(Recaptcha);

export { RecaptchaWithError };
