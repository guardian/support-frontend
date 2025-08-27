import { css } from '@emotion/react';
import { StudentBrandAwareness } from 'pages/[countryGroupId]/student/components/StudentBrandAwareness';

export default {
	title: 'LandingPage/StudentBrandAwareness',
	component: StudentBrandAwareness,
	parameters: {
		docs: {
			description: {
				component: `Brand awareness component used by the global student offer landing page.`,
			},
		},
	},
};

export const Template = () => {
	const contentContainer = css`
		max-width: 1300px;
	`;

	return (
		<div css={contentContainer}>
			<StudentBrandAwareness />
		</div>
	);
};
