// @flow

// ----- Imports ----- //

import React from 'react';

import { flashSaleIsActive } from 'helpers/flashSale';
import OptimizeExperimentWrapper from 'components/optimizeExperimentWrapper/optimizeExperimentWrapper';
import PriceCtaContainer from './priceCtaContainer';
import FindOutMoreCta from './findOutMoreCta';

import { experimentId } from '../helpers/ctaTypeAb';

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
    <OptimizeExperimentWrapper experimentId={experimentId}>
      {PriceCta}
      {PriceCta}
      <div />
    </OptimizeExperimentWrapper>
  );

}


// ----- Exports ----- //

export default CtaSwitch;
