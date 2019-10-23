// @flow

import React from 'react';
import Text, { SansParagraph } from 'components/text/text';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';
import type { CountryGroupName } from 'helpers/internationalisation/countryGroup';
import {
  fromCountryGroupName,
  International,
} from 'helpers/internationalisation/countryGroup';
import { Domestic, RestOfWorld } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { Annual, Quarterly } from 'helpers/billingPeriods';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import type { CountryGroupPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { Divider } from 'components/content/content';
import CopyrightText from 'pages/promotion-terms/CopyrightText';

type NameAndSaving = {name: CountryGroupName, saving: ?string};

const orderedCountryGroupNames: NameAndSaving[] = [
  { name: 'United Kingdom', saving: '35%' },
  { name: 'United States', saving: '31%' },
  { name: 'Australia', saving: '31%' },
  { name: 'Europe', saving: '26%' },
  { name: 'New Zealand', saving: '20%' },
  { name: 'Canada', saving: '16%' },
  { name: 'International', saving: null },
];

function FullTermsLink() {
  return (
    <div className="component-weekly-terms-copyright-footer">
      <Divider />
      <Text>
        For full subscription terms and conditions visit{' '}
        <a
          href="https://www.theguardian.com/guardian-weekly-subscription-terms-conditions"
          target="_blank"
          rel="noopener noreferrer"
        >
          theguardian.com/guardian-weekly-subscription-terms-conditions
        </a>
      </Text>
      <CopyrightText />
    </div>
  );
}

export default function WeeklyTerms(props: PromotionTermsPropTypes) {

  const includes6For6 = props.promotionTerms.productRatePlans
    .filter(ratePlan => ratePlan.includes('6 for 6')).length > 0;

  if (includes6For6) {
    return <SixForSix {...props} />;
  }
  return <StandardTerms {...props} />;
}

function getCountryPrice(countryGroupName: CountryGroupName, prices: CountryGroupPrices) {
  const { currency } = fromCountryGroupName(countryGroupName);
  const currencyGlyph = extendedGlyph(currency);
  const fulfilmentOption = countryGroupName === International ? RestOfWorld : Domestic;
  const quarterlyPrice = prices[fulfilmentOption][NoProductOptions][Quarterly][currency];
  const annualPrice = prices[fulfilmentOption][NoProductOptions][Annual][currency];
  return {
    currencyGlyph,
    quarterlyPrice,
    annualPrice,
  };
}

function getSaving(saving: ?string) {
  if (saving) {
    return `, saving ${saving} off the cover price.`;
  }
  return '.';
}

function StandardCountryPrice(nameAndSaving: NameAndSaving, prices: CountryGroupPrices) {
  const { quarterlyPrice, annualPrice } = getCountryPrice(nameAndSaving.name, prices);
  return (
    <SansParagraph>
      <strong>{nameAndSaving.name}:</strong>{' '}
      Quarterly (13 weeks) subscription rate {showPrice(quarterlyPrice)},
      or annual rate {showPrice(annualPrice)}{getSaving(nameAndSaving.saving)}
    </SansParagraph>
  );
}

function SixForSixCountryPrice(nameAndSaving: NameAndSaving, prices: CountryGroupPrices) {
  const { currencyGlyph, quarterlyPrice } = getCountryPrice(nameAndSaving.name, prices);
  return (
    <SansParagraph>
      <strong>{nameAndSaving.name}:</strong>{' '}
      Offer is {currencyGlyph}6 for the first 6 issues followed by quarterly (13 weeks)
      subscription payments of {showPrice(quarterlyPrice)} thereafter{getSaving(nameAndSaving.saving)}
    </SansParagraph>
  );
}

function StandardTerms(props: PromotionTermsPropTypes) {
  return (
    <div>
      <SansParagraph>
        Offer subject to availability. Guardian News and Media Limited (&quot;GNM&quot;)
        reserves the right to withdraw this promotion at any time.
      </SansParagraph>
      <SansParagraph>
        You must be 18+ to be eligible for a Guardian Weekly subscription.
      </SansParagraph>
      {
        orderedCountryGroupNames.map(nameAndSaving =>
          StandardCountryPrice(nameAndSaving, props.productPrices[nameAndSaving.name]))
      }
      <FullTermsLink />
    </div>
  );
}

function SixForSix(props: PromotionTermsPropTypes) {
  return (
    <div>
      <SansParagraph>
        Offer subject to availability. Guardian News and Media Limited (&quot;GNM&quot;)
        reserves the right to withdraw this promotion at any time.
      </SansParagraph>
      <SansParagraph>
        Offer not available to current subscribers of Guardian Weekly.
        You must be 18+ to be eligible for this offer.
        Guardian Weekly reserve the right to end this offer at any time.
      </SansParagraph>
      {
        orderedCountryGroupNames.map(nameAndSaving =>
          SixForSixCountryPrice(nameAndSaving, props.productPrices[nameAndSaving.name]))
      }
      <FullTermsLink />
    </div>
  );
}
