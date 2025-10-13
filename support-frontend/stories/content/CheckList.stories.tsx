import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source/react-components';
import type { BenefitsCheckListProps } from 'components/checkoutBenefits/benefitsCheckList';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

const boldText = css`
	font-weight: bold;
`;

const checkListData = [
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>The Digital Edition app. </span>Enjoy the Guardian
				and Observer newspaper, available for mobile and tablet
			</p>
		),
	},
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>Full access to the Guardian app. </span>
				Read our reporting on the go
			</p>
		),
	},
	{
		isChecked: true,
		text: (
			<p>
				<span css={boldText}>Free 14 day trial. </span>Enjoy a free trial of
				your subscription, before you pay
			</p>
		),
	},
];

export default {
	title: 'Content/Benefits Check List',
	component: BenefitsCheckList,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Columns
				collapseUntil="tablet"
				cssOverrides={css`
					width: 100%;
				`}
			>
				<Column span={[1, 8, 7]}>
					<Box>
						<BoxContents>
							<Story />
						</BoxContents>
					</Box>
				</Column>
			</Columns>
		),
		withCenterAlignment,
		withSourceReset,
	],
	argTypes: {
		benefitsCheckListData: { table: { disable: true } },
	},
};

function Template(args: BenefitsCheckListProps) {
	return <BenefitsCheckList {...args} />;
}

Template.args = {} as BenefitsCheckListProps;

export const Default = Template.bind({});

Default.args = {
	benefitsCheckListData: checkListData,
};

export const Compact = Template.bind({});

Compact.args = {
	benefitsCheckListData: checkListData,
	style: 'compact',
};
