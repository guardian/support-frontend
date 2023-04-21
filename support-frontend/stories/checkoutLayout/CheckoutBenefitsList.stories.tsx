import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import type { CheckoutBenefitsListProps } from 'components/checkoutBenefits/checkoutBenefitsList';
import { CheckoutBenefitsList } from 'components/checkoutBenefits/checkoutBenefitsList';
import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';

export default {
	title: 'Checkouts/Benefits List',
	component: CheckoutBenefitsList,
	argTypes: {
		handleButtonClick: { action: 'button clicked' },
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
	checkListData: checkListData({ higherTier: true }, true),
	buttonCopy: null,
	countryGroupId: 'GBPCountries',
};

export const LowerTierUnlocked = Template.bind({});

LowerTierUnlocked.args = {
	title: "For £5 per month, you'll unlock",
	checkListData: checkListData({ higherTier: false }, true),
	buttonCopy: 'Switch to £12 per month to unlock all extras',
	countryGroupId: 'GBPCountries',
};
