import { Radio, RadioGroup } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { NoFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { getBillingPeriodTitle } from 'helpers/productPrice/billingPeriods';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/productPrices';

type PropTypes = {
	productPrices: ProductPrices;
	billingPeriods: BillingPeriod[];
	fulfilmentOption?: FulfilmentOptions;
	pricingCountry: IsoCountry;
	selected: BillingPeriod;
	onChange: (period: BillingPeriod) => void;
};

function BillingPeriodSelector(props: PropTypes): JSX.Element {
	return (
		<FormSection title="How often would you like to pay?">
			<RadioGroup
				label="How often would you like to pay?"
				hideLabel
				role="radiogroup"
			>
				{props.billingPeriods.map((billingPeriod) => {
					const productPrice = getProductPrice(
						props.productPrices,
						props.pricingCountry,
						billingPeriod,
						props.fulfilmentOption,
					);
					return (
						<Radio
							label={getBillingPeriodTitle(billingPeriod)}
							value={getBillingPeriodTitle(billingPeriod)}
							supporting={getPriceDescription(productPrice, billingPeriod)}
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
