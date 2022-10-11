import { css } from '@emotion/react';
import React from 'react';
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

export function SecureTransactionIndicator(args: {
	position: string;
}): JSX.Element {
	return <SecureTransactionIndicatorComponent position={args.position} />;
}

SecureTransactionIndicator.args = {
	position: 'center',
};
