import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import { CheckoutBenefitsList } from 'components/checkoutBenefits/checkoutBenefitsList';
import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListContainer';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';

export default {
	title: 'Checkout Layout/Benefits List',
	component: CheckoutBenefitsList,
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

function Template(args: {
	title: string;
	higherTier: boolean;
	lowerTier: boolean;
}): JSX.Element {
	const { title, higherTier, lowerTier } = args;
	return (
		<CheckoutBenefitsList
			title={title}
			checkListData={checkListData({ lowerTier, higherTier })}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const AllBenefitsUnlocked = Template.bind({});

AllBenefitsUnlocked.args = {
	title: "For £12 per month, you'll unlock",
	higherTier: true,
	lowerTier: true,
};

export const LowerTierUnlocked = Template.bind({});

LowerTierUnlocked.args = {
	title: "For £5 per month, you'll unlock",
	higherTier: false,
	lowerTier: true,
};
