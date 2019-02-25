// @flow

// ----- Imports ----- //

import React from 'react';

import FindOutMoreCta from './findOutMoreCta';

import { showUpgradeMessage } from '../helpers/upgradePromotion';


// ----- Component ----- //

function CtaSwitch() {

  if (showUpgradeMessage()) {
    return <FindOutMoreCta />;
  }

  return null;
}


// ----- Exports ----- //

export default CtaSwitch;
