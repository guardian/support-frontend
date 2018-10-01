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
  const { referrerAcquisitionData, abParticipations, optimizeExperiments } = state.common;
  const price = getProductPrice('DigitalPack', countryGroupId);

  return {
    ctaText: 'Start your free trial now',
    url: getDigitalCheckout(
      referrerAcquisitionData,
      countryGroupId,
      ownProps.referringCta,
      abParticipations,
      optimizeExperiments,
    ),
    price: `${currencies[state.common.internationalisation.currencyId].glyph}${price}`,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PriceCta);
