import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import getPlanData from 'pages/paper-subscription-landing/planData';
import type { WeeklyBenefitsProps } from 'pages/weekly-subscription-landing/components/weeklyBenefits';
import { WeeklyBenefits } from 'pages/weekly-subscription-landing/components/weeklyBenefits';

export default {
	title: 'LandingPage/WeeklyBenefits',
	component: WeeklyBenefits,
};

function Template(args: WeeklyBenefitsProps) {
	const innerContentContainer = css`
		margin: 0 auto;
		background-color: ${palette.neutral[93]};
		padding: ${space[6]}px;
	`;

	return (
		<div css={innerContentContainer}>
			<WeeklyBenefits {...args} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});
Default.args = {
	planData: getPlanData('NoProductOptions', 'Domestic'),
};

export const RestOfWorld = Template.bind({});
RestOfWorld.args = {
	planData: getPlanData('NoProductOptions', 'RestOfWorld'),
};
