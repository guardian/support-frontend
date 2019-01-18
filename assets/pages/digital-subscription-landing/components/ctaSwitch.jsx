// @flow

// ----- Imports ----- //

import React from 'react';

import { flashSaleIsActive } from 'helpers/flashSale';
import CtaAbTestWrapper from './ctaAbTestWrapper';
import PriceCtaContainer from './priceCtaContainer';
import FindOutMoreCta from './findOutMoreCta';

import { showUpgradeMessage } from '../helpers/upgradePromotion';


// ----- Component ----- //

function CtaSwitch(props: { referringCta: string }) {

  if (showUpgradeMessage()) {
    return <FindOutMoreCta />;
  }

  const PriceCta = (<PriceCtaContainer
    ctaText={flashSaleIsActive('DigitalPack') ? 'Start your 14-day free trial' : null}
    referringCta={props.referringCta}
    secondaryCopy="You can cancel your subscription at any time"
  />
  );

  return (
    <CtaAbTestWrapper>
      {PriceCta}
      <div />
    </CtaAbTestWrapper>
  );

}


// ----- Exports ----- //

export default CtaSwitch;
