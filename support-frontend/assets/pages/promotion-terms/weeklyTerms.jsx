// @flow

import React from 'react';
import Text, { SansParagraph } from 'components/text/text';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';
import {
  fromCountryGroupName,
  International,
} from 'helpers/internationalisation/countryGroup';
import { Domestic, RestOfWorld } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { Quarterly } from 'helpers/billingPeriods';
import { glyph } from 'helpers/internationalisation/currency';
import { showPrice } from 'helpers/productPrice/productPrices';
import { Divider } from 'components/content/content';
import type { CountryGroupName } from 'helpers/internationalisation/countryGroup';
import type { CountryGroupPrices } from 'helpers/productPrice/productPrices';

export default function WeeklyTerms(props: PromotionTermsPropTypes) {

  const includes6For6 = props.promotionTerms.productRatePlans
    .filter(ratePlan => ratePlan.includes('6 for 6')).length > 0;

  if (includes6For6) {
    return <SixForSix {...props} />;
  }
  return (
    <div>
      <SansParagraph>
        Offer subject to availability. Guardian News and Media Limited (&quot;GNM&quot;)
        reserves the right to withdraw this promotion at any time.
      </SansParagraph>
    </div>
  );
}

function CountryPricing(countryGroupName: CountryGroupName, prices: CountryGroupPrices) {
  const { currency } = fromCountryGroupName(countryGroupName);
  const currencyGlyph = glyph(currency);
  const fulfilmentOption = countryGroupName === International ? RestOfWorld : Domestic;
  const quarterly = prices[fulfilmentOption][NoProductOptions][Quarterly][currency];
  return (
    <SansParagraph>
      <strong>{countryGroupName}:</strong> Offer is {currencyGlyph}6 for the first 6 issues followed
      by quarterly (13 weeks) subscription payments of {showPrice(quarterly)} thereafter,
      saving 35% off the cover price.
    </SansParagraph>
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
        Object.keys(props.productPrices)
        .map(name => CountryPricing(name, props.productPrices[name]))
      }
      <Divider />
      <Text>
        For full subscription terms and conditions visit
        <a
          href="https://www.theguardian.com/guardian-weekly-subscription-terms-conditions"
          target="_blank"
          rel="noopener noreferrer"
        >
          theguardian.com/guardian-weekly-subscription-terms-conditions
        </a>
      </Text>
      <Text>
        © Guardian News and Media Limited – a member of Guardian Media Group plc.
        Registered office: Kings Place, 90 York Way, London, N1 9GU. Registered in England No. 908396
      </Text>
    </div>
  );
}
