// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PriceCta from 'components/priceCta/priceCta';

import { digitalSubPrices } from 'helpers/subscriptions';
import { getDigitalCheckout } from 'helpers/externalLinks';
import type { CommonState } from 'helpers/page/page';
import { currencies } from 'helpers/internationalisation/currency';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {
  const { countryGroupId } = state.common.internationalisation;
  const price = digitalSubPrices[countryGroupId].toFixed(2);

  return {
    ctaText: 'Start a 14 day free trial',
    url: getDigitalCheckout(
      state.common.referrerAcquisitionData,
      state.common.internationalisation.countryGroupId,
    ),
    price: `${currencies[state.common.internationalisation.currencyId].glyph}${price}`,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PriceCta);
