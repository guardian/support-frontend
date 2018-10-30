// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { connect } from 'react-redux';

import CtaLink from 'components/ctaLink/ctaLink';
import GridPicture from 'components/gridPicture/gridPicture';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { type ComponentAbTest, type SubscriptionProduct } from 'helpers/subscriptions';
import type { HeadingSize } from 'components/heading/heading';
import { type Participations } from 'helpers/abTests/abtest';
import { type OptimizeExperiments } from 'helpers/tracking/optimize';
import { type CommonState } from 'helpers/page/page';
import FeaturedProductHero from 'components/featuredProductHero/featuredProductHero';
import { getQueryParameter } from 'helpers/url';

// ----- Types ----- //

type PropTypes = {|
  headingSize: HeadingSize,
  countryGroupId: CountryGroupId,
  abTest: ComponentAbTest | null,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  optimizeExperiments: OptimizeExperiments,
|};

type Product = {|
  name: SubscriptionProduct,
  headingText: string,
  bodyText: string,
  link: string,
  image: Node,
|}

const dpImage = (
  <GridPicture
    sources={[
      {
        gridId: 'digitalPackFlashSaleMobile',
        srcSizes: [140, 500, 717],
        imgType: 'png',
        sizes: '90vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'digitalPackFlashSaleDesktop',
        srcSizes: [140, 500, 1000, 1388],
        imgType: 'png',
        sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="digitalPackFlashSaleDesktop"
    fallbackSize={500}
    altText="ad-free, live and discover, and the daily edition"
    fallbackImgType="png"
  />);

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

  const products: {DigitalPack: Product, Paper: Product, GuardianWeekly: Product} = {
    DigitalPack: {
      name: 'DigitalPack',
      headingText: 'Digital Pack',
      bodyText: 'Read the Guardian ad-free on all devices, plus get all the benefits of the Premium App and Daily Edition iPad app of the UK newspaper',
      link: subsLinks.DigitalPack,
      image: dpImage,
    },
    Paper: {
      name: 'Paper',
      headingText: 'Print Subscription',
      bodyText: 'Save on The Guardian and The Observer retail price all year round.',
      link: subsLinks.Paper,
      image: dpImage,
    },
    GuardianWeekly: {
      name: 'GuardianWeekly',
      headingText: 'Guardian Weekly',
      bodyText: 'Our new, weekly magazine with free delivery worldwide',
      link: subsLinks.GuardianWeekly,
      image: dpImage,
    },
  };

  function getProduct(): ?Product {
    switch (getQueryParameter('ab_product')) {
      case 'DigitalPack':
        return products.DigitalPack;
      case 'Paper':
        return products.Paper;
      case 'GuardianWeekly':
        return products.GuardianWeekly;
      default:
        return null;
    }
  }

  const product = getProduct();

  return product && (
    <FeaturedProductHero
      headingText={product.headingText}
      bodyText={product.bodyText}
      image={product.image}
      cta={getCta(product)}
      headingSize={headingSize}
      product={product.name}
    />

  );
}


// ----- Default Props ----- //

FeaturedProductAb.defaultProps = {
  abTest: null,
};


// ----- Export ----- //

export default connect(mapStateToProps)(FeaturedProductAb);

