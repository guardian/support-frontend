import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import type { CheckoutBenefitsListProps } from 'components/checkoutBenefits/checkoutBenefitsList';
import { CheckoutBenefitsList } from 'components/checkoutBenefits/checkoutBenefitsList';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';

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
	title: 'Checkouts/Benefits List',
	component: CheckoutBenefitsList,
	argTypes: {
		handleButtonClick: { action: 'button clicked' },
		checkListData: { table: { disable: true } },
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Container backgroundColor={neutral[97]}>
				<Columns
					collapseUntil="tablet"
					cssOverrides={css`
						justify-content: center;
						padding: 1rem 0;
					`}
				>
					<Column width={[1, 3 / 4, 1 / 2]}>
						<Box>
							<BoxContents>
								<Story />
							</BoxContents>
						</Box>
					</Column>
				</Columns>
			</Container>
		),
	],
};

function Template(args: CheckoutBenefitsListProps) {
	return <CheckoutBenefitsList {...args} />;
}

Template.args = {} as Omit<CheckoutBenefitsListProps, 'handleButtonClick'>;

export const AllBenefitsUnlocked = Template.bind({});

AllBenefitsUnlocked.args = {
	title: "For £12 per month, you'll unlock",
	checkListData: checkListData,
	buttonCopy: null,
};

export const LowerTierUnlocked = Template.bind({});

LowerTierUnlocked.args = {
	title: "For £5 per month, you'll unlock",
	checkListData: checkListData,
	buttonCopy: 'Switch to £12 per month to unlock all extras',
};
