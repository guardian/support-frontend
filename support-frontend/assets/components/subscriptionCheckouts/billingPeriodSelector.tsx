import { Radio, RadioGroup } from '@guardian/src-radio';
import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { billingPeriodTitle } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	getAppliedPromoDescription,
	getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import type { Action } from 'helpers/subscriptionsForms/formActions';

type PropTypes = {
	productPrices: ProductPrices;
	billingPeriods: BillingPeriod[];
	fulfilmentOption?: FulfilmentOptions;
	pricingCountry: IsoCountry;
	selected: BillingPeriod;
	onChange: (arg0: BillingPeriod) => Action;
};

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
					return (
						<Radio
							label={billingPeriodTitle(billingPeriod)}
							value={billingPeriodTitle(billingPeriod)}
							supporting={getPriceDescription(productPrice, billingPeriod)}
							offer={getAppliedPromoDescription(productPrice)}
							name="billingPeriod"
							checked={billingPeriod === props.selected}
							onChange={() => props.onChange(billingPeriod)}
						/>
					);
				})}
			</RadioGroup>
		</FormSection>
	);
}

BillingPeriodSelector.defaultProps = {
	fulfilmentOption: NoFulfilmentOptions,
};
export { BillingPeriodSelector };
