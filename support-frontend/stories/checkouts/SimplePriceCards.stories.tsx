import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source-react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { SimplePriceCardsProps } from 'components/priceCards/simplePriceCards';
import { SimplePriceCards } from 'components/priceCards/simplePriceCards';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';
import { Default as InfoBlock } from '../content/InfoBlock.stories';

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
	title: 'Support Guardian journalism',
	subtitle: 'and unlock exclusive extras',
	contributionType: 'ANNUAL',
	countryGroupId: 'GBPCountries',
	prices: {
		monthly: 10,
		annual: 95,
	},
	children: (
		<div>
			<InfoBlock {...InfoBlock.args} />
		</div>
	),
};
