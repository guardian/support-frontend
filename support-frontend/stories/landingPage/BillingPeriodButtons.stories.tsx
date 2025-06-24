import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import { Column, Columns } from '@guardian/source/react-components';
import React from 'react';
import { Box } from 'components/checkoutBox/checkoutBox';
import type { BillingPeriodButtonsProps } from 'components/billingPeriodButtons/billingPeriodButtons';
import { BillingPeriodButtons } from 'components/billingPeriodButtons/billingPeriodButtons';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

import { BillingPeriod } from '@modules/product/billingPeriod';

export default {
	title: 'LandingPage/Billing Period Buttons',
	component: BillingPeriodButtons,
	argTypes: { buttonClickHandler: { action: 'billing period changed' } },
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
				component: `A button component for switching regular billing periods on the three tier landing page.`,
			},
		},
	},
};

function Template(args: BillingPeriodButtonsProps) {
	const billingPeriodButtonsCss = css`
		margin: ${space[4]}px auto 32px;
		${from.desktop} {
			margin: ${space[6]}px auto ${space[12]}px;
		}
	`;
	return (
		<BillingPeriodButtons
			{...args}
			additionalStyles={billingPeriodButtonsCss}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	billingPeriods: [BillingPeriod.Monthly, BillingPeriod.Annual],
	preselectedBillingPeriod: BillingPeriod.Monthly,
};
