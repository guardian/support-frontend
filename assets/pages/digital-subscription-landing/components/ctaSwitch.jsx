// @flow

// ----- Imports ----- //

import React from 'react';

import { flashSaleIsActive } from 'helpers/flashSale';
import PriceCtaContainer from './priceCtaContainer';
import FindOutMoreCta from './findOutMoreCta';

import { showUpgradeMessage } from '../helpers/upgradePromotion';


// ----- Component ----- //

function CtaSwitch(props: { referringCta: string }) {

  if (showUpgradeMessage()) {
    return <FindOutMoreCta referringCta={props.referringCta} />;
  }

  return (
    <PriceCtaContainer
      ctaText={flashSaleIsActive('DigitalPack') ? 'Start your 14-day free trial' : null}
      referringCta={props.referringCta}
      secondaryCopy="You can cancel your subscription at any time"
    />
  );

}


// ----- Exports ----- //

export default CtaSwitch;
