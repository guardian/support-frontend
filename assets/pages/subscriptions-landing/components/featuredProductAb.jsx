// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import CtaLink from 'components/ctaLink/ctaLink';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { type ComponentAbTest } from 'helpers/subscriptions';
import type { HeadingSize } from 'components/heading/heading';
import { type Participations } from 'helpers/abTests/abtest';
import { type OptimizeExperiments } from 'helpers/optimize/optimize';
import { type CommonState } from 'helpers/page/commonReducer';
import FeaturedProductHero from 'components/featuredProductHero/featuredProductHero';

import { getProduct, getProducts, type Product } from './featuredProducts';

// ----- Types ----- //

type PropTypes = {|
  headingSize: HeadingSize,
  countryGroupId: CountryGroupId,
  abTest: ComponentAbTest | null,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  optimizeExperiments: OptimizeExperiments,
|};


function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
    optimizeExperiments: state.common.optimizeExperiments,
  };

}

function FeaturedProductAb(props: PropTypes) {

  const {
    countryGroupId,
    headingSize,
    referrerAcquisitionData,
    abParticipations,
    abTest,
    optimizeExperiments,
  } = props;

  const getCta = ({ link, name }: Product) => (
    <CtaLink
      text="Subscribe now"
      url={link}
      accessibilityHint="Subscribe now"
      onClick={sendTrackingEventsOnClick(`featured_${name}_cta`, name, abTest)}
    />
  );

  const subsLinks = getSubsLinks(
    countryGroupId,
    referrerAcquisitionData.campaignCode,
    getCampaign(referrerAcquisitionData),
    referrerAcquisitionData,
    abParticipations,
    optimizeExperiments,
  );

  const product = getProduct(subsLinks, countryGroupId) || getProducts(subsLinks, countryGroupId).GuardianWeekly;

  return product ? (
    <FeaturedProductHero
      headingText={product.headingText}
      subheadingText={product.subheadingText}
      bodyText={product.bodyText}
      image={product.image}
      cta={getCta(product)}
      headingSize={headingSize}
      product={product.name}
    />) : null;

}


// ----- Default Props ----- //

FeaturedProductAb.defaultProps = {
  abTest: null,
};


// ----- Export ----- //

export default connect(mapStateToProps)(FeaturedProductAb);

