import { css } from '@emotion/react';
import { PosterComponent } from 'pages/[countryGroupId]/guardianAdLiteLanding/components/posterComponent';

export default {
	title: 'LandingPage/GuardianAdLite Poster',
	component: PosterComponent,
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
			<PosterComponent />
		</div>
	);
}
Template.args = {} as Record<string, unknown>;
export const Default = Template.bind({});
