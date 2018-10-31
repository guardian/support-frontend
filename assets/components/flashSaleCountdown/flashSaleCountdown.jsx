// @flow

// ----- Imports ----- //

import React from 'react';

import Countdown from 'components/countdown/countdown';
import { getEndTime } from 'helpers/flashSale';

// ----- Render ----- //

export default () => (
  <div className="component-flash-sale-countdown">
    <Countdown legend="until sale ends" to={getEndTime()} />
  </div>
);
