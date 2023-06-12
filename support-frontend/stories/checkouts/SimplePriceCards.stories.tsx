import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source-react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { SimplePriceCardsProps } from 'components/priceCards/simplePriceCards';
import { SimplePriceCards } from 'components/priceCards/simplePriceCards';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Simple Price Cards',
	component: SimplePriceCards,
	argTypes: {
		onPriceChange: { action: 'price changed' },
		countryGroupId: {
			options: [
				'GBPCountries',
				'UnitedStates',
				'AUDCountries',
				'EURCountries',
				'NZDCountries',
				'Canada',
				'International',
			],
			control: {
				type: 'select',
			},
		},
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

function Template(args: SimplePriceCardsProps) {
	return <SimplePriceCards {...args} />;
}

Template.args = {} as Omit<SimplePriceCardsProps, 'onPriceChange'>;

export const Default = Template.bind({});

Default.args = {
	title: 'Start your recurring support with exclusive extras',
	tagline: 'Extras include unlimited access to the app',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
	prices: {
		monthly: 10,
		annual: 95,
	},
	children: <p>Details go here</p>,
};
