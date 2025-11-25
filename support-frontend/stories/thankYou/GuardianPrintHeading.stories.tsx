import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import GuardianPrintHeading, {
	type GuardianPrintHeadingProps,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/GuardianPrintHeading';

export default {
	title: 'ThankYou/GuardianPrintHeading',
	component: GuardianPrintHeading,
	argTypes: {},
};

function Template(args: GuardianPrintHeadingProps) {
	const innerContentContainer = css`
		background-color: ${palette.neutral[97]};
		padding: ${space[6]}px;
	`;

	return (
		<div css={innerContentContainer}>
			<GuardianPrintHeading {...args} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const SaturdaySubsCard = Template.bind({});
SaturdaySubsCard.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SaturdayPlus',
};

export const EveryDayHomeDelivery = Template.bind({});
EveryDayHomeDelivery.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'EverydayPlus',
};
