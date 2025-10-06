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
	ratePlanKey: 'Monthly',
	recurringAmount: 5,
	abTestName: 'nudgeToLowRegular',
	abTestVariant: 'control',
};

export const US = Template.bind({});

US.args = {
	supportRegionId: SupportRegionId.US,
	ratePlanKey: 'Monthly',
	recurringAmount: 5,
	abTestName: 'nudgeToLowRegular',
	abTestVariant: 'control',
};

export const AU = Template.bind({});

AU.args = {
	supportRegionId: SupportRegionId.AU,
	ratePlanKey: 'Monthly',
	recurringAmount: 10,
	abTestName: 'nudgeToLowRegular',
	abTestVariant: 'control',
};

export const EU = Template.bind({});
EU.args = {
	supportRegionId: SupportRegionId.EU,
	ratePlanKey: 'Monthly',
	recurringAmount: 5,
	abTestName: 'nudgeToLowRegular',
	abTestVariant: 'control',
};
