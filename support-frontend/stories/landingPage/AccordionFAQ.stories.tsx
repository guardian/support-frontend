import { css } from '@emotion/react';
import {
	AccordionFAQProps,
	AccordionFAQ,
} from 'pages/[countryGroupId]/guardianAdLiteLanding/components/accordionFAQ';

export default {
	title: 'LandingPage/Accordian FAQ',
	component: AccordionFAQ,
	argTypes: {
		product: 'TierThree',
	},
};

function Template(args: AccordionFAQProps) {
	const innerContentContainer = css`
		max-width: 980px;
		margin: 0 auto;
		text-align: center;
	`;
	return (
		<div css={innerContentContainer}>
			<AccordionFAQ product={args.product} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});
Default.args = {
	product: 'TierThree',
};
export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	product: 'GuardianAdLite',
};
export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	product: 'SupporterPlus',
};
