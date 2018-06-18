// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PriceCta from 'components/priceCta/priceCta';

import { digitalSubPrices } from 'helpers/subscriptions';
import { getDigitalCheckout } from 'helpers/externalLinks';
import type { CommonState } from 'helpers/page/page';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {

  const price = digitalSubPrices[state.common.countryGroup].toFixed(2);

  return {
    ctaText: 'Start a 14 day free trial',
    url: getDigitalCheckout(state.common.referrerAcquisitionData),
    price: `${state.common.currency.glyph}${price}`,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PriceCta);
