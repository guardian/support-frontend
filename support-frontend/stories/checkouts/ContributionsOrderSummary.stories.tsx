import { css } from '@emotion/react';
import { Button, Column, Columns } from '@guardian/source-react-components';
import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { ContributionsOrderSummaryProps } from 'components/orderSummary/contributionsOrderSummary';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Contributions Order Summary',
	component: ContributionsOrderSummary,
	argTypes: { onAccordionClick: { action: 'accordion clicked' } },
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

function Template(props: ContributionsOrderSummaryProps) {
	return <ContributionsOrderSummary {...props} />;
}

Template.args = {} as ContributionsOrderSummaryProps;

export const Default = Template.bind({});

Default.args = {
	contributionType: 'MONTHLY',
	total: 10,
	totalBeforeAmended: 10,
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: checkListData({ higherTier: true, showUnchecked: false }),
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
	tsAndCs: (
		<>
			<p>Auto renews every month until you cancel.</p>
			<p>
				Cancel or change your support anytime. If you cancel within the first 14
				days, you will receive a full refund.
			</p>
		</>
	),
};

export const SingleContribution = Template.bind({});

SingleContribution.args = {
	contributionType: 'ONE_OFF',
	total: 25,
	totalBeforeAmended: 25,
	currency: {
		glyph: '$',
		extendedGlyph: 'US$',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: [],
	headerButton: (
		<Button priority="tertiary" size="xsmall">
			Change
		</Button>
	),
};
