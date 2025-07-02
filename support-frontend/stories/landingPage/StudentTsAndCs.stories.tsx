import { css } from '@emotion/react';
import {
	StudentTsAndCs,
	StudentTsAndCsProps,
} from 'pages/[countryGroupId]/student/components/studentTsAndCs';

export default {
	title: 'LandingPage/StudentTsAndCs',
	component: StudentTsAndCs,
	argTypes: {
		countryGroupId: 'AUDCountries',
	},
};

function Template(args: StudentTsAndCsProps) {
	const innerContentContainer = css`
		max-width: 980px;
		margin: 0 auto;
	`;
	return (
		<div css={innerContentContainer}>
			<StudentTsAndCs geoId={args.geoId} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const DefaultAUD = Template.bind({});
DefaultAUD.args = {
	geoId: 'au',
};
