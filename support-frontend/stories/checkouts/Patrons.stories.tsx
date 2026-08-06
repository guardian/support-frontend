import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { supportRegions } from '@modules/internationalisation/supportRegion';
import type React from 'react';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Patrons Message',
	component: PatronsMessage,
	argTypes: {
		supportRegionId: {
			options: Object.keys(supportRegions) as SupportRegionId[],
			control: { type: 'radio' },
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Columns
				collapseUntil="tablet"
				cssOverrides={css`
					width: 100%;
				`}
			>
				<Column span={[1, 8, 7]}>
					<Story />
				</Column>
			</Columns>
		),
		withCenterAlignment,
		withSourceReset,
	],
};

function Template(args: { supportRegionId: SupportRegionId }) {
	return <PatronsMessage supportRegionId={args.supportRegionId} />;
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	supportRegionId: 'uk',
};
