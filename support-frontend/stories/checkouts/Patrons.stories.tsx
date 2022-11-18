import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source-react-components';
import React from 'react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Patrons Message',
	component: PatronsMessage,
	argTypes: {
		countryGroup: {
			options: Object.keys(countryGroups) as CountryGroupId[],
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

function Template(args: { countryGroup: CountryGroupId }) {
	return <PatronsMessage countryGroupId={args.countryGroup} />;
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	countryGroup: 'GBPCountries',
};
