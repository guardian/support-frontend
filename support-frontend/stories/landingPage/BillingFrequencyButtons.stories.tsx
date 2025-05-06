import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import { Column, Columns } from '@guardian/source/react-components';
import React from 'react';
import { Box } from 'components/checkoutBox/checkoutBox';
import type { BillingFrequencyButtonsProps } from 'components/billingFrequencyButtons/billingFrequencyButtons';
import { BillingFrequencyButtons } from 'components/billingFrequencyButtons/billingFrequencyButtons';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'LandingPage/Payment Frequency Buttons',
	component: BillingFrequencyButtons,
	argTypes: { buttonClickHandler: { action: 'payment frequency changed' } },
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Columns
				collapseUntil="tablet"
				cssOverrides={css`
					width: 100%;
				`}
			>
				<Column span={[1, 8, 7]}>
					<Box
						cssOverrides={css`
							background-color: ${palette.brand[400]};
						`}
					>
						<Story />
					</Box>
				</Column>
			</Columns>
		),
		withCenterAlignment,
		withSourceReset,
	],
	parameters: {
		docs: {
			description: {
				component: `A button component for switching regular payment frequencies on the three tier landing page.`,
			},
		},
	},
};

function Template(args: BillingFrequencyButtonsProps) {
	const paymentFrequencyButtonsCss = css`
		margin: ${space[4]}px auto 32px;
		${from.desktop} {
			margin: ${space[6]}px auto ${space[12]}px;
		}
	`;
	return (
		<BillingFrequencyButtons
			{...args}
			additionalStyles={paymentFrequencyButtonsCss}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	paymentFrequencies: [
		{
			paymentFrequencyLabel: 'Monthly',
			paymentFrequencyId: 'MONTHLY',
			isPreSelected: true,
		},
		{
			paymentFrequencyLabel: 'Annual',
			paymentFrequencyId: 'ANNUAL',
			isPreSelected: false,
		},
	],
};
