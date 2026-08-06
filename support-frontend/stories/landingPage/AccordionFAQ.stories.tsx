import { css } from '@emotion/react';
import type {
	AccordionFAQProps} from 'pages/[supportRegionId]/components/accordionFAQ';
import {
	AccordionFAQ
} from 'pages/[supportRegionId]/components/accordionFAQ';
import { adLiteFAQs } from 'pages/[supportRegionId]/guardianAdLiteLanding/helpers/adLiteFAQs';
import { getStudentFAQs } from 'pages/[supportRegionId]/student/helpers/studentFAQs';

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

export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	faqItems: adLiteFAQs,
};
export const StudentAud = Template.bind({});
StudentAud.args = {
	faqItems: getStudentFAQs('au'),
};
export const StudentGbp = Template.bind({});
StudentGbp.args = {
	faqItems: getStudentFAQs('uk'),
};
