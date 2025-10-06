import { Column, Columns } from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import {
	CheckoutNudgeThankYou,
	CheckoutNudgeThankYouProps,
} from 'components/checkoutNudge/checkoutNudge';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';
import { css } from '@emotion/react';
import { SupportRegionId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';

export default {
	title: 'Checkouts/Checkout Nudge Thank You',
	component: CheckoutNudgeThankYou,
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

function Template(props: CheckoutNudgeThankYouProps) {
	return <CheckoutNudgeThankYou {...props} />;
}

Template.args = {} as CheckoutNudgeThankYouProps;

export const Default = Template.bind({});

Default.args = {
	supportRegionId: SupportRegionId.UK,
};

export const US = Template.bind({});

US.args = {
	supportRegionId: SupportRegionId.US,
};
