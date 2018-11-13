// @flow

// ----- Imports ----- //
import React, { type Node } from 'react';

import { type SubsUrls } from 'helpers/externalLinks';
import { getQueryParameter } from 'helpers/url';
import { discountedDisplayPrice, type SubscriptionProduct } from 'helpers/subscriptions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import GridPicture from 'components/gridPicture/gridPicture';
import { flashSaleIsActive } from 'helpers/flashSale';


// ----- Types ----- //
type Product = {|
  name: SubscriptionProduct,
  headingText: string,
  subheadingText: string,
  bodyText: string,
  link: string,
  image: Node,
|}


// ----- Exports ----- //
const dpImage = (
  <GridPicture
    sources={[
      {
        gridId: 'digitalPackFlashSaleMobile',
        srcSizes: [140, 500, 1000],
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
    altText=""
    fallbackImgType="png"
  />);

const weeklyImage = (
  <GridPicture
    sources={[
      {
        gridId: 'guardianWeeklyHeroMobile',
        srcSizes: [140, 500, 1000],
        imgType: 'png',
        sizes: '90vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'guardianWeeklyHeroDesktop',
        srcSizes: [140, 500, 1000],
        imgType: 'png',
        sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="guardianWeeklyHeroDesktop"
    fallbackSize={500}
    altText=""
    fallbackImgType="png"
  />);

const paperImage = (
  <GridPicture
    sources={[
      {
        gridId: 'paperHeroMobile',
        srcSizes: [140, 500, 1000],
        imgType: 'png',
        sizes: '90vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'paperHeroDesktop',
        srcSizes: [140, 500, 1000],
        imgType: 'png',
        sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="paperHeroDesktop"
    fallbackSize={500}
    altText=""
    fallbackImgType="png"
  />);

const getDigitalPackSubHeadingAndBody = (countryGroupId: CountryGroupId) => {
  if (flashSaleIsActive('DigitalPack')) {
    return {
      subheadingText: 'Save 50% for three months',
      bodyText: `Read the Guardian ad-free on all devices, including the Premium App and Daily Edition iPad app. ${discountedDisplayPrice('DigitalPack', countryGroupId)} for your first three months.`,
    };
  }

  return {
    subheadingText: 'Screen time well spent',
    bodyText: (countryGroupId === 'GBPCountries') ?
      'Read the Guardian ad-free on all devices, plus get all the benefits of the Premium App and Daily Edition iPad app of the newspaper.' :
      'Read the Guardian ad-free on all devices, plus get all the benefits of the Premium App and Daily Edition iPad app of the UK newspaper.',
  };
};


const getProducts = (
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
): {DigitalPack: Product, Paper: Product, GuardianWeekly: Product} => ({
  DigitalPack: {
    name: 'DigitalPack',
    headingText: 'Digital Pack',
    ...getDigitalPackSubHeadingAndBody(countryGroupId),
    link: subsLinks.DigitalPack,
    image: dpImage,
  },
  Paper: {
    name: 'Paper',
    headingText: 'Paper subscription',
    subheadingText: 'Enjoy every word for less',
    bodyText: flashSaleIsActive('Paper') ? 'Save 50% for three months on subscriptions to The Guardian and The Observer' :
      'Save on The Guardian and The Observer retail price all year round.',
    link: subsLinks.Paper,
    image: paperImage,
  },
  GuardianWeekly: {
    name: 'GuardianWeekly',
    headingText: 'Guardian Weekly',
    subheadingText: 'Open up your world view',
    bodyText: 'Discover our essential new magazine with free worldwide delivery.',
    link: subsLinks.GuardianWeekly,
    image: weeklyImage,
  },
});

const getProduct = (subsLinks: SubsUrls, countryGroupId: CountryGroupId): ?Product => {
  switch (getQueryParameter('ab_product')) {
    case 'DigitalPack':
      return getProducts(subsLinks, countryGroupId).DigitalPack;
    case 'Paper':
      return getProducts(subsLinks, countryGroupId).Paper;
    case 'GuardianWeekly':
      return getProducts(subsLinks, countryGroupId).GuardianWeekly;
    default:
      return null;
  }
};

export { getProduct, getProducts };
export type { Product };
