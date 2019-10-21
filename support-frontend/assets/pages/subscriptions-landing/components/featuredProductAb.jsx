// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { type ComponentAbTest } from 'helpers/subscriptions';
import type { HeadingSize } from 'components/heading/heading';
import { type Participations } from 'helpers/abTests/abtest';
import { type CommonState } from 'helpers/page/commonReducer';
import FeaturedProductHero from 'components/featuredProductHero/featuredProductHero';
import { getProduct, type Product } from './featuredProducts';
import { showCountdownTimer } from '../../../helpers/flashSale';
import AnchorButton from 'components/button/anchorButton';


// ----- Types ----- //

type PropTypes = {|
  headingSize: HeadingSize,
  countryGroupId: CountryGroupId,
  abTest: ComponentAbTest | null,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
|};


function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
  };

}

function FeaturedProductAb(props: PropTypes) {

  const {
    countryGroupId,
    headingSize,
    referrerAcquisitionData,
    abParticipations,
    abTest,
  } = props;

  const getCta = ({ link, name }: Product) => (
    <AnchorButton
      href={link}
      aria-label="Subscribe now"
      onClick={sendTrackingEventsOnClick(`featured_${name}_cta`, name, abTest)}
    >
      Subscribe now
    </AnchorButton>
  );

  const subsLinks = getSubsLinks(
    countryGroupId,
    referrerAcquisitionData.campaignCode,
    getCampaign(referrerAcquisitionData),
    referrerAcquisitionData,
    abParticipations,
  );

  const product = getProduct(subsLinks, countryGroupId);

  return product ? (
    <FeaturedProductHero
      headingText={product.headingText}
      subheadingText={product.subheadingText}
      bodyText={product.bodyText}
      image={product.image}
      cta={getCta(product)}
      headingSize={headingSize}
      product={product.name}
      hasTimer={showCountdownTimer(product.name, countryGroupId)}
      countryGroupId={countryGroupId}
    />) : null;

}


// ----- Default Props ----- //

FeaturedProductAb.defaultProps = {
  abTest: null,
};


// ----- Export ----- //

export default connect(mapStateToProps)(FeaturedProductAb);

