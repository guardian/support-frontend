// @flow
import React from 'react';

import { Fieldset } from 'components/forms/fieldset';
import { RadioInputWithHelper } from 'components/forms/customFields/radioInputWithHelper';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { billingPeriodTitle } from 'helpers/billingPeriods';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import {
  getBillingDescription,
  hasDiscountOrPromotion,
} from 'helpers/productPrice/priceDescriptionsDigital';
import {
  getAppliedPromoDescription,
} from 'helpers/productPrice/priceDescriptions';


type PropTypes = {|
  productPrices: ProductPrices,
  billingPeriods: DigitalBillingPeriod[],
  billingCountry: IsoCountry,
  selected: DigitalBillingPeriod,
  onChange: (DigitalBillingPeriod) => Action,
|}

function BillingPeriodSelectorDigital(props: PropTypes) {
  return (
    <FormSection title="How often would you like to pay?">
      <Fieldset legend="How often would you like to pay?" role="radiogroup">
        {props.billingPeriods.map((billingPeriod) => {
          const productPrice = getProductPrice(
            props.productPrices,
            props.billingCountry,
            billingPeriod,
            'NoFulfilmentOptions',
          );
          const offerText = hasDiscountOrPromotion(productPrice)
            ? getAppliedPromoDescription(billingPeriod, productPrice)
            : '';
          return (<RadioInputWithHelper
            text={billingPeriodTitle(billingPeriod)}
            helper={getBillingDescription(
              productPrice,
              billingPeriod,
            )}
            offer={offerText}
            name="billingPeriod"
            checked={billingPeriod === props.selected}
            onChange={() => props.onChange(billingPeriod)}
          />);
        })}
      </Fieldset>
    </FormSection>);
}

export { BillingPeriodSelectorDigital };
