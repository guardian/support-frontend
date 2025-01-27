import { css } from '@emotion/react';
import { Button, Column, Columns } from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { ContributionsOrderSummaryProps } from 'components/orderSummary/contributionsOrderSummary';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

const boldText = css`
	font-weight: bold;
`;

const checkListData = [
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>The Digital Edition app. </span>Enjoy the Guardian
				and Observer newspaper, available for mobile and tablet
			</p>
		),
	},
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>Full access to the Guardian app. </span>
				Read our reporting on the go
			</p>
		),
	},
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>Free 14 day trial. </span>Enjoy a free trial of
				your subscription, before you pay
			</p>
		),
	},
];

export default {
	title: 'Checkouts/Contributions Order Summary',
	component: ContributionsOrderSummary,
	argTypes: { onCheckListToggle: { action: 'accordion clicked' } },
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
	description: 'Monthly support',
	paymentFrequency: 'month',
	enableCheckList: true,
	amount: 10,
	currency: {
		glyph: '£',
		extendedGlyph: '£',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	checkListData: checkListData,
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
	description: 'One-off contribution',
	enableCheckList: false,
	amount: 25,
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
