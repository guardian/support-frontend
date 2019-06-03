// @flow
import React from 'react';

import { Fieldset } from 'components/forms/fieldset';
import { RadioInputWithHelper } from 'components/forms/customFields/radioInputWithHelper';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { type Option } from 'helpers/types/option';
import {
  billingPeriodTitle,
  Quarterly,
  SixWeekly,
} from 'helpers/billingPeriods';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import {
  getAppliedPromoDescription,
  getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';

type PropTypes = {|
  productPrices: ProductPrices,
  billingPeriods: BillingPeriod[],
  fulfilmentOption?: FulfilmentOptions,
  billingCountry: IsoCountry,
  selected: BillingPeriod,
  onChange: (BillingPeriod) => Action,
  orderIsAGift?: Option<boolean>,
|}

function BillingPeriodSelector(props: PropTypes) {
  return (
    <FormSection title="How often would you like to pay?">
      <Fieldset legend="How often would you like to pay?">
        {props.billingPeriods.map((billingPeriod) => {
          const productPrice = getProductPrice(
            props.productPrices,
            props.billingCountry,
            billingPeriod === SixWeekly ? Quarterly : billingPeriod, // for 6 for 6 we need the quarterly pricing
            props.fulfilmentOption,
          );
          return props.orderIsAGift && billingPeriod === SixWeekly ? null
            : <RadioInputWithHelper
              text={billingPeriodTitle(billingPeriod)}
              helper={getPriceDescription(
                productPrice,
                billingPeriod,
              )}
              offer={getAppliedPromoDescription(billingPeriod, productPrice)}
              name="billingPeriod"
              checked={billingPeriod === props.selected}
              onChange={() => props.onChange(billingPeriod)}
            />;
        })}
      </Fieldset>
    </FormSection>);
}

BillingPeriodSelector.defaultProps = {
  fulfilmentOption: NoFulfilmentOptions,
  orderIsAGift: false,
};

export { BillingPeriodSelector };
