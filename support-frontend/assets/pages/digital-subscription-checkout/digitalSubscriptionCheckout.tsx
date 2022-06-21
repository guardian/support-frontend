// ----- Imports ----- //
import { FocusStyleManager } from '@guardian/source-foundations';
import { Provider } from 'react-redux';
import Page from 'components/page/page';
import HeaderWrapper from 'components/subscriptionCheckouts/headerWrapper';
import CheckoutStage from 'components/subscriptionCheckouts/stage';
import MarketingConsent from 'components/subscriptionCheckouts/thankYou/marketingConsentContainer';
import MarketingConsentGift from 'components/subscriptionCheckouts/thankYou/marketingConsentContainerGift';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import type {
	DigitalBillingPeriod,
	DigitalGiftBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import {
	Annual,
	Monthly,
	Quarterly,
} from 'helpers/productPrice/billingPeriods';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { initReduxForSubscriptions } from 'helpers/redux/subscriptionsStore';
import { renderPage } from 'helpers/rendering/render';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getQueryParameter } from 'helpers/urls/url';
import CheckoutForm from 'pages/digital-subscription-checkout/components/digitalCheckoutForm';
import CheckoutFormGift from 'pages/digital-subscription-checkout/components/digitalCheckoutFormGift';
import ThankYouContent from 'pages/digital-subscription-checkout/thankYouContainer';
import ThankYouGift from 'pages/digital-subscription-checkout/thankYouGift';
import { DigitalFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import ThankYouPendingContent from './thankYouPendingContent';
import 'stylesheets/skeleton/skeleton.scss';
import './digitalSubscriptionCheckout.scss';

// ----- Redux Store ----- //
function getInitialBillingPeriod(
	periodInUrl?: string,
): DigitalBillingPeriod | DigitalGiftBillingPeriod {
	const { orderIsAGift } = window.guardian;

	switch (periodInUrl) {
		case 'Monthly':
			return Monthly;

		case 'Quarterly':
			return Quarterly;

		case 'Annual':
			return Annual;

		default:
			if (orderIsAGift) {
				return Quarterly;
			}

			return Monthly;
	}
}

const billingPeriodInUrl = getQueryParameter('period');
const initialBillingPeriod = getInitialBillingPeriod(billingPeriodInUrl || '');
setUpTrackingAndConsents();

const reducer = () =>
	createReducer(DigitalPack, initialBillingPeriod, null, null, null);

const store = initReduxForSubscriptions(reducer);
const { countryGroupId, countryId, currencyId } =
	store.getState().common.internationalisation;
const { orderIsAGift, productPrices, billingPeriod } =
	store.getState().page.checkout;

const thankyouProps = {
	countryGroupId,
	marketingConsent: orderIsAGift ? (
		<MarketingConsentGift />
	) : (
		<MarketingConsent />
	),
	productPrices,
	billingPeriod,
	currencyId,
};

FocusStyleManager.onlyShowFocusOnTabs();

// ----- Render ----- //
const content = orderIsAGift ? (
	<Provider store={store}>
		<Page
			header={<HeaderWrapper />}
			footer={
				<DigitalFooter
					country={countryId}
					productPrices={productPrices}
					orderIsAGift
				/>
			}
		>
			<CheckoutStage
				checkoutForm={<CheckoutFormGift />}
				thankYouContentPending={<ThankYouGift {...thankyouProps} pending />}
				thankYouContent={<ThankYouGift {...thankyouProps} />}
				subscriptionProduct="DigitalPack"
			/>
		</Page>
	</Provider>
) : (
	<Provider store={store}>
		<Page
			header={<HeaderWrapper />}
			footer={
				<DigitalFooter
					country={countryId}
					productPrices={productPrices}
					orderIsAGift={false}
				/>
			}
		>
			<CheckoutStage
				checkoutForm={<CheckoutForm />}
				thankYouContentPending={
					<ThankYouPendingContent includePaymentCopy {...thankyouProps} />
				}
				thankYouContent={<ThankYouContent {...thankyouProps} />}
				subscriptionProduct="DigitalPack"
			/>
		</Page>
	</Provider>
);

renderPage(content, 'digital-subscription-checkout-page');
