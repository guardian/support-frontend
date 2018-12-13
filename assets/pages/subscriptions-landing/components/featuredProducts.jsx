// @flow

// ----- Imports ----- //
import React, { type Node } from 'react';

import { type SubsUrls } from 'helpers/externalLinks';
import { getQueryParameter } from 'helpers/url';
import { type SubscriptionProduct } from 'helpers/subscriptions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import GridPicture from 'components/gridPicture/gridPicture';
import { flashSaleIsActive, getSaleCopy } from 'helpers/flashSale';


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
        srcSizes: [140, 500],
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

const getProductHeadingsAndBody = (product: SubscriptionProduct, countryGroupId: CountryGroupId) => {
  if (flashSaleIsActive(product, countryGroupId)) {
    const saleCopy = getSaleCopy(product, countryGroupId);
    return {
      headingText: `${saleCopy.bundle.heading}`,
      subheadingText: `${saleCopy.bundle.subHeading}`,
      bodyText: `${saleCopy.bundle.description}`,
    };
  }

  if (product === 'DigitalPack') {
    return {
      headingText: 'Digital Pack',
      subheadingText: 'Screen time well spent',
      bodyText: (countryGroupId === 'GBPCountries') ?
        'Read the Guardian ad-free on all devices, plus get all the benefits of the Premium App and Daily Edition iPad app of the newspaper.' :
        'Read the Guardian ad-free on all devices, plus get all the benefits of the Premium App and Daily Edition iPad app of the UK newspaper.',
    };
  }

  if (product === 'Paper') {
    return {
      headingText: 'Paper subscription',
      subheadingText: 'Enjoy every word for less',
      bodyText: 'Save on The Guardian and The Observer retail price all year round.',
    };
  }

  // if (product === 'GuardianWeekly') {
  return {
    headingText: 'Guardian Weekly',
    subheadingText: 'Open up your world view',
    bodyText: 'Discover our essential new magazine with free worldwide delivery.',
  };
  // }
};

const getProducts = (
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
): {DigitalPack: Product, Paper: Product, GuardianWeekly: Product} => ({
  DigitalPack: {
    name: 'DigitalPack',
    ...getProductHeadingsAndBody('DigitalPack', countryGroupId),
    link: subsLinks.DigitalPack,
    image: dpImage,
  },
  Paper: {
    name: 'Paper',
    ...getProductHeadingsAndBody('Paper', countryGroupId),
    link: subsLinks.Paper,
    image: paperImage,
  },
  GuardianWeekly: {
    name: 'GuardianWeekly',
    ...getProductHeadingsAndBody('GuardianWeekly', countryGroupId),
    link: subsLinks.GuardianWeekly,
    image: weeklyImage,
  },
});

const getProduct = (subsLinks: SubsUrls, countryGroupId: CountryGroupId): ?Product => {
  const products = getProducts(subsLinks, countryGroupId);
  switch (getQueryParameter('ab_product')) {
    case 'DigitalPack':
      return products.DigitalPack;
    case 'Paper':
      return products.Paper;
    case 'GuardianWeekly':
      return products.GuardianWeekly;
    default:
      if (countryGroupId === 'GBPCountries') {
        return products.Paper;
      }
      if (countryGroupId !== 'GBPCountries' && flashSaleIsActive('DigitalPack', countryGroupId)) {
        return products.DigitalPack;
      }
      return products.GuardianWeekly;
  }
};

export { getProduct };
export type { Product };
