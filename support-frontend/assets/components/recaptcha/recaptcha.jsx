// @flow

import React from 'react';
import './recaptcha.scss';

export function Recaptcha() {
  return (
    <>
      <div id="robot_checkbox" className="robot_checkbox" />
      <p className="recaptcha-terms ">
        By ticking this box, you agree to let Google check if you are human. Please refer to their <a href='https://policies.google.com/terms'>Terms</a> and <a href='https://policies.google.com/privacy'>Privacy</a> policies.
      </p>
    </>
  );
}
