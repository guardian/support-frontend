import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import CheckoutBenefitsListComponent from 'components/checkoutBenefits/checkoutBenefitsList';
import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListContainer';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';

export default {
	title: 'Checkout Layout/Benefits List',
	component: CheckoutBenefitsListComponent,
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

export function BenefitsList(args: {
	title: string;
	showBenefitsMessaging: boolean;
}): JSX.Element {
	return (
		<CheckoutBenefitsListComponent
			title={args.title}
			checkListData={checkListData(args.showBenefitsMessaging)}
		/>
	);
}

BenefitsList.args = {
	title: "For £12 per month, you'll unlock",
	showBenefitsMessaging: true,
};
