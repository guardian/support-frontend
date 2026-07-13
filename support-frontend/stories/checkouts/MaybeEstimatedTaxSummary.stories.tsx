import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source/react-components';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { Props as MaybeEstimatedTaxSummaryProps } from 'components/salesTax/maybeEstimatedTaxSummary';
import { MaybeEstimatedTaxSummary } from 'components/salesTax/maybeEstimatedTaxSummary';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Maybe Estimated Tax Summary',
	component: MaybeEstimatedTaxSummary,
	argTypes: {},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Columns
				collapseUntil="tablet"
				cssOverrides={css`
					width: 100%;
				`}
			>
				<Column span={[1, 8, 7]}>
					<Story />
				</Column>
			</Columns>
		),
		withCenterAlignment,
		withSourceReset,
	],
};

function Template(args: MaybeEstimatedTaxSummaryProps) {
	return <MaybeEstimatedTaxSummary {...args} />;
}

Template.args = {} as MaybeEstimatedTaxSummaryProps;

export const TaxExclusive = Template.bind({});
TaxExclusive.args = {
	currency: getCurrencyInfo('CAD'),
	finalAmount: 120,
	originalAmount: 120,
	taxRateConfig: {
		type: 'tax_exclusive',
		rate: 0.13,
	},
	billingPeriod: BillingPeriod.Annual,
	fullPrice: '$120',
	discountPrice: undefined,
};

export const NotEnoughInformation = Template.bind({});
NotEnoughInformation.args = {
	currency: getCurrencyInfo('CAD'),
	finalAmount: 20,
	originalAmount: 20,
	taxRateConfig: {
		type: 'not_enough_information',
	},
	billingPeriod: BillingPeriod.Monthly,
	fullPrice: '$20',
	discountPrice: undefined,
};

export const WithDiscount = Template.bind({});
WithDiscount.args = {
	currency: getCurrencyInfo('CAD'),
	finalAmount: 60,
	originalAmount: 60,
	taxRateConfig: {
		type: 'tax_exclusive',
		rate: 0.13,
	},
	billingPeriod: BillingPeriod.Annual,
	fullPrice: '$120',
	discountPrice: '$60',
};
