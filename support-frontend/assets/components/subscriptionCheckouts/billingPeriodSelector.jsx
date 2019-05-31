// @flow
import React from 'react';

import { Fieldset } from 'components/forms/fieldset';
import { RadioInputWithHelper } from 'components/forms/customFields/radioInputWithHelper';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { Quarterly, SixWeekly } from 'helpers/billingPeriods';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import type {
  ProductPrice,
  ProductPrices,
} from 'helpers/productPrice/productPrices';
import {
  getAppliedPromo,
  getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import {
  extendedGlyph,
  fromCountryGroupId,
} from 'helpers/internationalisation/currency';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import {
  fromCountry,
  GBPCountries,
} from 'helpers/internationalisation/countryGroup';

type PropTypes = {|
  productPrices: ProductPrices,
  billingPeriods: BillingPeriod[],
  fulfilmentOption?: FulfilmentOptions,
  billingCountry: IsoCountry,
  selected: BillingPeriod,
  onChange: (BillingPeriod) => Action,
|}

function getTitle(billingPeriod: BillingPeriod) {
  if (billingPeriod === SixWeekly) { return '6 for 6'; }
  return billingPeriod;
}

function getOffer(billingPeriod: BillingPeriod, productPrice: ProductPrice) {
  const appliedPromo = getAppliedPromo(productPrice.promotions);
  if (
    appliedPromo === null ||
    appliedPromo.introductoryPrice && billingPeriod === Quarterly
  ){
    return '';
  }

  return  appliedPromo.description;
}

const getGlyph = (country: IsoCountry) => {
  const currency = fromCountryGroupId(fromCountry(country) || GBPCountries);
  return extendedGlyph(currency || 'GBP');
};

function BillingPeriodSelector(props: PropTypes) {
  return (
    <FormSection title="How often would you like to pay?">
      <Fieldset legend="How often would you like to pay?">
        {props.billingPeriods.map((billingPeriod) => {
          const productPrice = getProductPrice(
            props.productPrices,
            props.billingCountry,
            billingPeriod === SixWeekly ? Quarterly : billingPeriod,
            props.fulfilmentOption,
          );

          return (<RadioInputWithHelper
            text={getTitle(billingPeriod)}
            helper={getPriceDescription(
              getGlyph(props.billingCountry),
              productPrice,
              billingPeriod,
            )}
            offer={getOffer(billingPeriod, productPrice)}
            name="billingPeriod"
            checked={billingPeriod === props.selected}
            onChange={() => props.onChange(billingPeriod)}
          />);
        })}
      </Fieldset>
    </FormSection>);
}

BillingPeriodSelector.defaultProps = {
  fulfilmentOption: NoFulfilmentOptions,
};

export { BillingPeriodSelector };
