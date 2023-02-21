import { css } from '@emotion/react';
import React from 'react';
import type { SecureTransactionIndicatorProps } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { SecureTransactionIndicator as SecureTransactionIndicatorComponent } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

const maxWidth = css`
	max-width: 360px;
`;
export default {
	title: 'Checkouts/Secure Transaction Indicator',
	component: SecureTransactionIndicatorComponent,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div css={maxWidth}>
				<Story />
			</div>
		),
		withCenterAlignment,
	],
};

function Template(args: SecureTransactionIndicatorProps): JSX.Element {
	return <SecureTransactionIndicatorComponent {...args} />;
}

Template.args = {} as SecureTransactionIndicatorProps;

export const DarkTheme = Template.bind({});

DarkTheme.args = {
	theme: 'dark',
};

export const LightTheme = Template.bind({});

LightTheme.args = {
	theme: 'light',
};

export const IconOnly = Template.bind({});

IconOnly.args = {
	hideText: true,
};
