import { Column, Columns } from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import {
	CheckoutNudge,
	CheckoutNudgeProps,
} from 'components/checkoutNudge/checkoutNudge';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';
import { css } from '@emotion/react';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';

export default {
	title: 'Checkouts/Checkout Nudge',
	component: CheckoutNudge,
	argTypes: {},
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

function Template(props: CheckoutNudgeProps) {
	return <CheckoutNudge {...props} />;
}

Template.args = {} as CheckoutNudgeProps;

export const Default = Template.bind({});

Default.args = {
	supportRegionId: SupportRegionId.UK,
	heading: 'Make a bigger impact',
	body: 'The reliability of recurring support powers our journalism in perpetuity. Could you make a small monthly contribution instead? Cancel anytime.',
	product: 'Contribution',
	ratePlan: 'Monthly',
	amount: 5,
};

export const Annual = Template.bind({});

Annual.args = {
	supportRegionId: SupportRegionId.UK,
	heading: 'Make a bigger impact',
	body: 'The reliability of recurring support powers our journalism in perpetuity. Could you make an annual contribution instead? Cancel anytime.',
	product: 'Contribution',
	ratePlan: 'Annual',
	amount: 5,
};

export const BenefitsList = Template.bind({});

BenefitsList.args = {
	supportRegionId: SupportRegionId.UK,
	heading: 'Make the biggest impact',
	product: 'SupporterPlus',
	ratePlan: 'Monthly',
	amount: 15,
	benefits: {
		label: 'Your all-access benefits:',
		checkListData: [{'isChecked':true,'text':'Unlimited access to the Guardian app'},{'isChecked':true,'text':'Ad-free reading on all your devices'}],
	},
};
