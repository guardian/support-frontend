// ----- Imports ----- //
import { FocusStyleManager } from '@guardian/source-foundations';
import { Provider } from 'react-redux';
import WeeklyFooter from 'components/footerCompliant/WeeklyFooter';
import Page from 'components/page/page';
import HeaderWrapper from 'components/subscriptionCheckouts/headerWrapper';
import CheckoutStage from 'components/subscriptionCheckouts/stage';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import type { WeeklyBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { postIntroductorySixForSixBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Domestic } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import type { CommonState } from 'helpers/redux/commonState/state';
import { initReduxForSubscriptions } from 'helpers/redux/subscriptionsStore';
import { renderPage } from 'helpers/rendering/render';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { promotionTermsUrl } from 'helpers/urls/routes';
import { getQueryParameter } from 'helpers/urls/url';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import ThankYouContent from './components/thankYou';
import WeeklyCheckoutForm from './components/weeklyCheckoutForm';
import WeeklyCheckoutFormGifting from './components/weeklyCheckoutFormGifting';
import 'stylesheets/skeleton/skeleton.scss';

setUpTrackingAndConsents();
// ----- Redux Store ----- //
const billingPeriodInUrl = getQueryParameter('period');
const initialBillingPeriod: WeeklyBillingPeriod =
	billingPeriodInUrl === 'SixWeekly' ||
	billingPeriodInUrl === 'Monthly' ||
	billingPeriodInUrl === 'Quarterly' ||
	billingPeriodInUrl === 'Annual'
		? billingPeriodInUrl
		: postIntroductorySixForSixBillingPeriod;
const startDate = formatMachineDate(getWeeklyDays()[0]);

const reducer = (commonState: CommonState) =>
	createWithDeliveryCheckoutReducer(
		commonState.internationalisation.countryId,
		GuardianWeekly,
		initialBillingPeriod,
		startDate,
		NoProductOptions,
		Domestic, // TODO: we need to work this out from the country
	);

const store = initReduxForSubscriptions(reducer);
const {
	orderIsAGift,
	billingPeriod,
	productPrices,
	fulfilmentOption,
	productOption,
} = store.getState().page.checkout;
const { countryId } = store.getState().common.internationalisation;
const productPrice = getProductPrice(
	productPrices,
	countryId,
	billingPeriod,
	fulfilmentOption,
	productOption,
);
const appliedPromo = getAppliedPromo(productPrice.promotions);
const defaultPromo = orderIsAGift ? 'GW20GIFT1Y' : '10ANNUAL';
const promoTermsLink = promotionTermsUrl(
	appliedPromo ? appliedPromo.promoCode : defaultPromo,
);
FocusStyleManager.onlyShowFocusOnTabs();
// ----- Render ----- //
const content = (
	<Provider store={store}>
		<Page
			header={<HeaderWrapper />}
			footer={<WeeklyFooter promoTermsLink={promoTermsLink} />}
		>
			<CheckoutStage
				checkoutForm={
					orderIsAGift ? <WeeklyCheckoutFormGifting /> : <WeeklyCheckoutForm />
				}
				thankYouContentPending={
					<ThankYouContent isPending orderIsGift={orderIsAGift ?? false} />
				}
				thankYouContent={
					<ThankYouContent
						isPending={false}
						orderIsGift={orderIsAGift ?? false}
					/>
				}
				subscriptionProduct="GuardianWeekly"
			/>
		</Page>
	</Provider>
);
renderPage(content, 'weekly-subscription-checkout-page');
