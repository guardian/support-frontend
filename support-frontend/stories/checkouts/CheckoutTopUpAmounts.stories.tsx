import { CheckoutTopUpAmounts } from 'components/checkoutTopUpAmounts/checkoutTopUpAmounts';
import type { CheckoutTopUpAmountsProps } from 'components/checkoutTopUpAmounts/checkoutTopUpAmounts';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Checkouts/TopUp Amounts',
	component: CheckoutTopUpAmounts,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					width: '100%',
					maxWidth: '500px',
				}}
			>
				<Story />
			</div>
		),
		withCenterAlignment,
	],
};

function Template(args: CheckoutTopUpAmountsProps) {
	return (
		<CheckoutTopUpAmounts
			currencySymbol={args.currencySymbol}
			timePeriod={args.timePeriod}
			amounts={args.amounts}
			isWithinThreshold={args.isWithinThreshold}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const UKMonthlyTopUpAmounts = Template.bind({});

UKMonthlyTopUpAmounts.args = {
	currencySymbol: '£',
	timePeriod: 'month',
	amounts: [1, 2, 3, 4, 5],
	isWithinThreshold: true,
};

export const UKYearlyTopUpAmounts = Template.bind({});

UKYearlyTopUpAmounts.args = {
	currencySymbol: '£',
	timePeriod: 'year',
	amounts: [1, 2, 3, 4, 5],
	isWithinThreshold: true,
};

export const USMonthlyTopUpAmounts = Template.bind({});

USMonthlyTopUpAmounts.args = {
	currencySymbol: '$',
	timePeriod: 'month',
	amounts: [1, 2, 3, 4, 5],
	isWithinThreshold: true,
};
