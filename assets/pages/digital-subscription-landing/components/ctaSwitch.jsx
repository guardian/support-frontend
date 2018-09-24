// @flow

// ----- Imports ----- //

import React from 'react';
import PriceCtaContainer from './priceCtaContainer';
import FindOutMoreCta from './findOutMoreCta';
import { showPromotion } from '../helpers/promotions';

export default function CtaSwitch(props: {referringCta: string}) {
  return showPromotion() ?
    <FindOutMoreCta referringCta={props.referringCta} /> :
    <PriceCtaContainer referringCta={props.referringCta} />;
}
