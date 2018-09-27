// @flow

// ----- Imports ----- //

import React from 'react';

import PriceCtaContainer from './priceCtaContainer';
import FindOutMoreCta from './findOutMoreCta';
import { showPromotion } from '../helpers/promotions';


// ----- Component ----- //

function CtaSwitch(props: { referringCta: string }) {

  if (showPromotion()) {
    return <FindOutMoreCta referringCta={props.referringCta} />;
  }

  return (
    <PriceCtaContainer
      referringCta={props.referringCta}
      secondaryCopy="You can cancel your subscription at any time"
    />
  );

}


// ----- Exports ----- //

export default CtaSwitch;
