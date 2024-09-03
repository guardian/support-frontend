import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source/react-components';
import type { BenefitsCheckListProps } from 'components/checkoutBenefits/benefitsCheckList';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

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
};

function Template(args: BenefitsCheckListProps) {
	return <BenefitsCheckList {...args} />;
}

Template.args = {} as BenefitsCheckListProps;

export const Default = Template.bind({});

Default.args = {
	benefitsCheckListData: checkListData({
		higherTier: true,
		countryGroupId: 'GBPCountries',
	}),
};

export const Compact = Template.bind({});

Compact.args = {
	benefitsCheckListData: checkListData({
		higherTier: true,
		countryGroupId: 'GBPCountries',
	}),
	style: 'compact',
};
