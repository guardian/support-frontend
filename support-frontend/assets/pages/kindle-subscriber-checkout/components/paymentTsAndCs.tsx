import { css } from '@emotion/react';
import { neutral, textSans } from '@guardian/source-foundations';
import { privacyLink } from 'helpers/legal';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import {
	getSubscriptionPriceForBillingPeriod,
	getSubscriptionPricesBeforeDiscount,
} from 'helpers/redux/checkout/product/selectors/subscriptionPrice';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { manageSubsUrl } from 'helpers/urls/externalLinks';

const marginTop = css`
	margin-top: 4px;
`;

const container = css`
	${textSans.xxsmall()};
	color: ${neutral[20]};

	& a {
		color: ${neutral[20]};
	}
`;

const manageMyAccount = (
	<a
		href={manageSubsUrl}
		onClick={sendTrackingEventsOnClick({
			id: 'checkout_my_account',
			product: 'PremiumTier',
			componentType: 'ACQUISITIONS_BUTTON',
		})}
	>
		Manage My Account
	</a>
);

const terms = (linkText: string) => (
	<a href="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
		{linkText}
	</a>
);

function TsAndCsFooterLinks() {
	const privacy = <a href={privacyLink}>Privacy Policy</a>;

	return (
		<div css={marginTop}>
			By proceeding, you are agreeing to our{' '}
			<a href="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
				Terms and Conditions
			</a>
			.{' '}
			<p css={marginTop}>
				To find out what personal data we collect and how we use it, please
				visit our {privacy}.
			</p>
		</div>
	);
}

export function PaymentTsAndCs(): JSX.Element {
	const priceString = useContributionsSelector(
		getSubscriptionPriceForBillingPeriod,
	);

	const basePrices = useContributionsSelector(
		getSubscriptionPricesBeforeDiscount,
	);

	const { billingPeriod } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const frequency = (billingPeriod: BillingPeriod) =>
		billingPeriod === 'Monthly' ? 'month' : 'year';

	return (
		<div css={container}>
			Introductory and free trial offers for new subscribers only. Offers can
			only be applied once. Payment taken after the first 14 day free trial at{' '}
			{priceString} per {frequency(billingPeriod)} for the first year.
			Thereafter, your subscription will auto-renew, and you will be charged,
			each {frequency(billingPeriod)} at the full price of{' '}
			{basePrices.monthlyPrice} per month or {basePrices.annualPrice} per year
			unless you cancel. You can cancel at any time before your next renewal
			date. Cancellation will take effect at the end of your current
			subscription {frequency(billingPeriod)} . To cancel, go to{' '}
			{manageMyAccount} or see our {terms('Terms')}.
			<TsAndCsFooterLinks />
		</div>
	);
}
