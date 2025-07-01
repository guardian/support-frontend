import { css } from '@emotion/react';
import {
	AccordionFAQProps,
	AccordionFAQ,
} from 'pages/[countryGroupId]/components/accordionFAQ';
import { productFAQ } from 'pages/[countryGroupId]/helpers/productFAQ';

export default {
	title: 'LandingPage/Accordian FAQ',
	component: AccordionFAQ,
};

function Template(args: AccordionFAQProps) {
	const innerContentContainer = css`
		max-width: 980px;
		margin: 0 auto;
		text-align: center;
	`;
	return (
		<div css={innerContentContainer}>
			<AccordionFAQ faqItems={args.faqItems} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});
Default.args = {
	faq: productFAQ['TierThree']?.['UnitedStates'],
};
export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	faq: productFAQ['GuardianAdLite']?.['GBPCountries'],
};
export const SupporterPlusAud = Template.bind({});
SupporterPlusAud.args = {
	faq: productFAQ['SupporterPlus']?.['AUDCountries'],
};
export const SupporterPlusGbp = Template.bind({});
SupporterPlusGbp.args = {
	faq: productFAQ['SupporterPlus']?.['GBPCountries'],
};
