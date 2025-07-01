import { css } from '@emotion/react';
import {
	AccordionFAQProps,
	AccordionFAQ,
} from 'pages/[countryGroupId]/components/accordionFAQ';
import { adLiteFAQs } from 'pages/[countryGroupId]/guardianAdLiteLanding/helpers/adLiteFAQs';
import { studentFAQs } from 'pages/[countryGroupId]/student/helpers/studentFAQs';

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
	faqItems: undefined,
};
export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	faqItems: adLiteFAQs,
};
export const StudentAud = Template.bind({});
StudentAud.args = {
	faqItems: studentFAQs['AUDCountries'],
};
export const StudentGbp = Template.bind({});
StudentGbp.args = {
	faqItems: studentFAQs['GBPCountries'],
};
