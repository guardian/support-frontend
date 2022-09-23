import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source-react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { PriceCardsProps } from 'components/priceCards/priceCards';
import { PriceCards } from 'components/priceCards/priceCards';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Price Cards',
	component: PriceCards,
	argTypes: {
		onAmountChange: { action: 'amount changed' },
		currency: {
			control: {
				type: 'select',
				options: [
					'GBP',
					'USD',
					'AUD',
					'EUR',
					'NZD',
					'CAD',
					'SEK',
					'CHF',
					'NOK',
					'DKK',
				],
			},
		},
		paymentInterval: { control: { type: 'radio', options: ['month', 'year'] } },
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Columns
				collapseUntil="tablet"
				cssOverrides={css`
					width: 100%;
				`}
			>
				<Column span={[1, 8, 7]}>
					<Box>
						<BoxContents>
							<Story />
						</BoxContents>
					</Box>
				</Column>
			</Columns>
		),
		withCenterAlignment,
		withSourceReset,
	],
};

function Template(args: PriceCardsProps) {
	return <PriceCards {...args} />;
}

Template.args = {} as Omit<PriceCardsProps, 'onAmountChange'>;

export const SingleContribution = Template.bind({});

SingleContribution.args = {
	amounts: ['5', '12', '15', '20'],
	selectedAmount: '12',
	currency: 'GBP',
};

export const RecurringContribution = Template.bind({});

RecurringContribution.args = {
	amounts: ['5', '12', '15', '20'],
	selectedAmount: '12',
	currency: 'GBP',
	paymentInterval: 'month',
};
