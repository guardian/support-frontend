import { css } from '@emotion/react';
import { AccordionFAQ } from 'pages/[countryGroupId]/guardianAdLiteLanding/components/accordianFAQ';

export default {
	title: 'LandingPage/GuardianAdLite Accordian',
	component: <AccordionFAQ product={'GuardianAdLite'} />,
	argTypes: {},
};

function Template() {
	const innerContentContainer = css`
		max-width: 980px;
		margin: 0 auto;
		text-align: center;
	`;
	return (
		<div css={innerContentContainer}>
			<AccordionFAQ product={'GuardianAdLite'} />
		</div>
	);
}
Template.args = {} as Record<string, unknown>;
export const Default = Template.bind({});
