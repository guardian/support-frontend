import { css } from '@emotion/react';
import React from 'react';
import { ErrorSummary as ErrorSummaryComponent } from 'components/subscriptionCheckouts/submitFormErrorSummary';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

const maxWidth = css`
	max-width: 360px;
`;
export default {
	title: 'Checkouts/Error Summary',
	component: ErrorSummaryComponent,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div css={maxWidth}>
				<Story />
			</div>
		),
		withCenterAlignment,
	],
};

export function ErrorSummary(args: {
	errors: Array<Record<string, string>>;
}): JSX.Element {
	return <ErrorSummaryComponent errors={args.errors} />;
}

ErrorSummary.args = {
	errors: [
		{
			message: 'Please enter a valid account name',
		},
		{
			message: 'Please enter a valid sort code',
		},
		{
			message: 'Please enter a valid account number',
		},
		{
			message: 'Please confirm you are the account holder',
		},
	],
};
