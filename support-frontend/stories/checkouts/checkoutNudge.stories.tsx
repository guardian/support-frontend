import { Column, Columns } from '@guardian/source/react-components';
import { Box, BoxContents } from "components/checkoutBox/checkoutBox";
import { CheckoutNudge, CheckoutNudgeProps } from "components/checkoutNudge/checkoutNudge";
import { withCenterAlignment } from "../../.storybook/decorators/withCenterAlignment";
import { withSourceReset } from "../../.storybook/decorators/withSourceReset";
import { css } from "@emotion/react";


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
    return <CheckoutNudge {...props} />
}

Template.args= {} as CheckoutNudgeProps;

export const Default = Template.bind({});

Default.args = {
        geoId: 'uk',
        ratePlanKey: 'Monthly',
        recurringAmount: 5,
        abTestName: 'abNudgeToLowRegular',
        abTestVariant: 'v1',
}

export const US_V1 = Template.bind({});

US_V1.args = {
	geoId: 'us',
	ratePlanKey: 'Monthly',
	recurringAmount: 5,
	abTestName: 'abNudgeToLowRegular',
	abTestVariant: 'v1',
};

export const AU_v1 = Template.bind({});

AU_v1.args = {
	geoId: 'us',
	ratePlanKey: 'Monthly',
	recurringAmount: 10,
	abTestName: 'abNudgeToLowRegular',
	abTestVariant: 'v1',
};

export const EU_v1 = Template.bind({});
EU_v1.args = {
	geoId: 'eu',
	ratePlanKey: 'Monthly',
	recurringAmount: 5,
	abTestName: 'abNudgeToLowRegular',
	abTestVariant: 'v1',
};

export const UK_v2 = Template.bind({});
UK_v2.args = {
	geoId: 'uk',
	ratePlanKey: 'Monthly',
	recurringAmount: 5,
	abTestName: 'abNudgeToLowRegular',
	abTestVariant: 'v2',
};

export const US_V2 = Template.bind({});

US_V2.args = {
	geoId: 'us',
	ratePlanKey: 'Monthly',
	recurringAmount: 5,
	abTestName: 'abNudgeToLowRegular',
	abTestVariant: 'v2',
};

export const AU_v2 = Template.bind({});

AU_v2.args = {
	geoId: 'us',
	ratePlanKey: 'Monthly',
	recurringAmount: 10,
	abTestName: 'abNudgeToLowRegular',
	abTestVariant: 'v2',
};

export const EU_v2 = Template.bind({});
EU_v2.args = {
	geoId: 'eu',
	ratePlanKey: 'Monthly',
	recurringAmount: 5,
	abTestName: 'abNudgeToLowRegular',
	abTestVariant: 'v2',
};

