// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PriceCta from 'components/priceCta/priceCta';

import { getDigitalCheckout } from 'helpers/externalLinks';
import type { CommonState } from 'helpers/page/page';
import { currencies } from 'helpers/internationalisation/currency';
import { getProductPrice } from 'helpers/subscriptions';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }, ownProps: { referringCta: ?string }) {
  const { countryGroupId } = state.common.internationalisation;
  const { referrerAcquisitionData } = state.common;
  const price = getProductPrice('DigitalPack', countryGroupId);

  return {
    ctaText: 'Start a 14 day free trial',
    url: getDigitalCheckout(
      referrerAcquisitionData,
      countryGroupId,
      ownProps.referringCta,
    ),
    price: `${currencies[state.common.internationalisation.currencyId].glyph}${price}`,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PriceCta);
