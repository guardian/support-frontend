// ----- Imports ----- //
import { FocusStyleManager } from '@guardian/source-foundations';
import { Provider } from 'react-redux';
import Page from 'components/page/page';
import HeaderWrapper from 'components/subscriptionCheckouts/headerWrapper';
import CheckoutStage from 'components/subscriptionCheckouts/stage';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import type { WeeklyBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { postIntroductorySixForSixBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { initReduxForSubscriptions } from 'helpers/redux/subscriptionsStore';
import { renderPage } from 'helpers/rendering/render';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getQueryParameter } from 'helpers/urls/url';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
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

const reducer = () => createReducer();

const store = initReduxForSubscriptions(
	GuardianWeekly,
	initialBillingPeriod,
	reducer,
	startDate,
	NoProductOptions,
	getWeeklyFulfilmentOption,
);

const { orderIsAGift, productPrices } =
	store.getState().page.checkoutForm.product;
const { countryId } = store.getState().common.internationalisation;
FocusStyleManager.onlyShowFocusOnTabs();
// ----- Render ----- //
const content = (
	<Provider store={store}>
		<Page
			header={<HeaderWrapper />}
			footer={
				<GuardianWeeklyFooter
					productPrices={productPrices}
					orderIsAGift={!!orderIsAGift}
					country={countryId}
				/>
			}
		>
			<CheckoutStage
				checkoutForm={
					orderIsAGift ? <WeeklyCheckoutFormGifting /> : <WeeklyCheckoutForm />
				}
				thankYouContentPending={
					<ThankYouContent isPending orderIsGift={orderIsAGift} />
				}
				thankYouContent={
					<ThankYouContent isPending={false} orderIsGift={orderIsAGift} />
				}
				subscriptionProduct="GuardianWeekly"
			/>
		</Page>
	</Provider>
);
renderPage(content, 'weekly-subscription-checkout-page');
