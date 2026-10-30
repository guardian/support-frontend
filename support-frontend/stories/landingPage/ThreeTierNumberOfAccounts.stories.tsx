import { css } from '@emotion/react';
import { defaultCardTheme, redCardTheme } from 'helpers/landingPage/cardTheme';
import type { ThreeTierNumberOfAccountsProps } from 'pages/supporter-plus-landing/components/threeTierNumberOfAccounts';
import { ThreeTierNumberOfAccounts } from 'pages/supporter-plus-landing/components/threeTierNumberOfAccounts';

export default {
	productKey: 'DigitalSubscription',
	cardTheme: defaultCardTheme,
	multipleAccountsVariant: 'V1',
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

export const DigitalSubscriptionV1Default = Template.bind({});
DigitalSubscriptionV1Default.args = {
	productKey: 'DigitalSubscription',
	cardTheme: defaultCardTheme,
	multipleAccountsVariant: 'V1',
};

export const DigitalSubscriptionV1Red = Template.bind({});
DigitalSubscriptionV1Red.args = {
	productKey: 'DigitalSubscription',
	cardTheme: redCardTheme,
	multipleAccountsVariant: 'V1',
};

export const DigitalSubscriptionV2Default = Template.bind({});
DigitalSubscriptionV2Default.args = {
	productKey: 'DigitalSubscription',
	cardTheme: defaultCardTheme,
	multipleAccountsVariant: 'V2',
};

export const DigitalSubscriptionV2Red = Template.bind({});
DigitalSubscriptionV2Red.args = {
	productKey: 'DigitalSubscription',
	cardTheme: redCardTheme,
	multipleAccountsVariant: 'V2',
};

export const SupporterPlusV1 = Template.bind({});
SupporterPlusV1.args = {
	productKey: 'SupporterPlus',
	cardTheme: defaultCardTheme,
	multipleAccountsVariant: 'V1',
};

export const SupporterPlusV2 = Template.bind({});
SupporterPlusV2.args = {
	productKey: 'SupporterPlus',
	cardTheme: defaultCardTheme,
	multipleAccountsVariant: 'V2',
};
