import { css } from '@emotion/react';
import { AccordianComponent } from 'pages/[countryGroupId]/guardianLightLanding/components/accordianComponent';

export default {
	title: 'LandingPage/GuardianLight Accordian',
	component: AccordianComponent,
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
			<AccordianComponent />
		</div>
	);
}
Template.args = {} as Record<string, unknown>;
export const Default = Template.bind({});
