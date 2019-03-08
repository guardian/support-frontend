// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PriceCta from 'components/priceCta/priceCta';

import { getDigitalCheckout } from 'helpers/externalLinks';
import type { CommonState } from 'helpers/page/commonReducer';
import { currencies } from 'helpers/internationalisation/currency';
import { getProductPrice } from 'helpers/subscriptions';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {
  const { countryGroupId } = state.common.internationalisation;
  const price = getProductPrice('PremiumTier', countryGroupId);

  return {
    ctaText: 'Start a 7 day free trial',
    url: getDigitalCheckout(countryGroupId),
    price: `${currencies[state.common.internationalisation.currencyId].glyph}${price}`,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PriceCta);
