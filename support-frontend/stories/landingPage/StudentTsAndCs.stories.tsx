import { css } from '@emotion/react';
import {
	StudentTsAndCs,
	StudentTsAndCsProps,
} from 'pages/[countryGroupId]/student/components/studentTsAndCs';
import { getStudentTsAndCs } from 'pages/[countryGroupId]/student/helpers/studentTsAndCsCopy';

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
			<StudentTsAndCs tsAndCsItem={args.tsAndCsItem} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const DefaultAUD = Template.bind({});
DefaultAUD.args = {
	tsAndCsItem: getStudentTsAndCs('au'),
};
