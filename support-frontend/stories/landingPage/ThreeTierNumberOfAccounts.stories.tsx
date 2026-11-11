import { css } from '@emotion/react';
import { defaultCardTheme, redCardTheme } from 'helpers/landingPage/cardTheme';
import type { ThreeTierNumberOfAccountsProps } from 'pages/supporter-plus-landing/components/threeTierNumberOfAccounts';
import { ThreeTierNumberOfAccounts } from 'pages/supporter-plus-landing/components/threeTierNumberOfAccounts';

export default {
	productKey: 'DigitalSubscription',
	cardTheme: defaultCardTheme,
};

function Template(args: ThreeTierNumberOfAccountsProps) {
	const innerContentContainer = css`
		max-width: 276px;
		margin: 0 auto;
	`;
	return (
		<div css={innerContentContainer}>
			<ThreeTierNumberOfAccounts {...args} />
		</div>
	);
}
Template.args = {} as Record<string, unknown>;

export const DigitalSubscriptionDefault = Template.bind({});
DigitalSubscriptionDefault.args = {
	productKey: 'DigitalSubscription',
	cardTheme: defaultCardTheme,
};

export const DigitalSubscriptionRed = Template.bind({});
DigitalSubscriptionRed.args = {
	productKey: 'DigitalSubscription',
	cardTheme: redCardTheme,
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	cardTheme: defaultCardTheme,
};
