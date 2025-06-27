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
			<AccordionFAQ
				product={args.product}
				countryGroupId={args.countryGroupId}
			/>
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});
Default.args = {
	product: 'TierThree',
	countryGroupId: 'UnitedStates',
};
export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	product: 'GuardianAdLite',
	countryGroupId: 'GBPCountries',
};
export const SupporterPlusAud = Template.bind({});
SupporterPlusAud.args = {
	product: 'SupporterPlus',
	countryGroupId: 'AUDCountries',
};
export const SupporterPlusGbp = Template.bind({});
SupporterPlusGbp.args = {
	product: 'SupporterPlus',
	countryGroupId: 'GBPCountries',
};
