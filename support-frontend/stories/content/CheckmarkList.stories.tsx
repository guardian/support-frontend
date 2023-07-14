import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source-react-components';
import type { CheckmarkListProps } from 'components/checkmarkList/checkmarkList';
import { CheckmarkList } from 'components/checkmarkList/checkmarkList';
import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Content/Checkmark List',
	component: CheckmarkList,
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
};

function Template(args: CheckmarkListProps) {
	return <CheckmarkList {...args} />;
}

Template.args = {} as CheckmarkListProps;

export const Default = Template.bind({});

Default.args = {
	checkListData: checkListData({ higherTier: true }),
};

export const Compact = Template.bind({});

Compact.args = {
	checkListData: checkListData({ higherTier: true }),
	style: 'compact',
};
