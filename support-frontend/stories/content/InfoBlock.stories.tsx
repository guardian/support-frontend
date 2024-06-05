import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { InfoBlockProps } from 'components/infoBlock/infoBlock';
import { InfoBlock } from 'components/infoBlock/infoBlock';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Content/Info Block',
	component: InfoBlock,
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

function Template(args: InfoBlockProps) {
	return <InfoBlock {...args} />;
}

Template.args = {} as InfoBlockProps;

export const Default = Template.bind({});

Default.args = {
	header: (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
			`}
		>
			<span>Total due today</span>
			{''}
			<strong
				css={css`
					font-weight: 700;
				`}
			>
				£95
			</strong>
		</div>
	),
	content: (
		<ul>
			<li>Next billing date will be XX Month Year.</li>
			<li>
				Cancel or change your support anytime. If you cancel within the first 14
				days, you will receive a full refund.
			</li>
		</ul>
	),
};
