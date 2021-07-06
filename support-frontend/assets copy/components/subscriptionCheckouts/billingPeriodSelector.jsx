// @flow
import React from 'react';

import { RadioGroup, Radio } from '@guardian/src-radio';
import { billingPeriodTitle, type BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { getProductPrice, type ProductPrices } from 'helpers/productPrice/productPrices';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { NoFulfilmentOptions, type FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import {
  getAppliedPromoDescription,
  getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';

type PropTypes = {|
  productPrices: ProductPrices,
  billingPeriods: BillingPeriod[],
  fulfilmentOption?: FulfilmentOptions,
  pricingCountry: IsoCountry,
  selected: BillingPeriod,
  onChange: (BillingPeriod) => Action,
|}

function BillingPeriodSelector(props: PropTypes) {
  return (
    <FormSection title="How often would you like to pay?">
      <RadioGroup legend="How often would you like to pay?" role="radiogroup">
        {props.billingPeriods.map((billingPeriod) => {
          const productPrice = getProductPrice(
            props.productPrices,
            props.pricingCountry,
            billingPeriod,
            props.fulfilmentOption,
          );
          return (<Radio
            label={billingPeriodTitle(billingPeriod)}
            value={billingPeriodTitle(billingPeriod)}
            supporting={getPriceDescription(
              productPrice,
              billingPeriod,
            )}
            offer={getAppliedPromoDescription(billingPeriod, productPrice)}
            name="billingPeriod"
            checked={billingPeriod === props.selected}
            onChange={() => props.onChange(billingPeriod)}
          />);
        })}
      </RadioGroup>
    </FormSection>);
}

BillingPeriodSelector.defaultProps = {
  fulfilmentOption: NoFulfilmentOptions,
};

export { BillingPeriodSelector };
