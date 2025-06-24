// ----- Imports ----- //
import { FocusStyleManager } from '@guardian/source/foundations';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { NoProductOptions } from '@modules/product/productOptions';
import { Provider } from 'react-redux';
import Page from 'components/page/page';
import HeaderWrapper from 'components/subscriptionCheckouts/headerWrapper';
import CheckoutStage from 'components/subscriptionCheckouts/stage';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { toRegularBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { initReduxForSubscriptions } from 'helpers/redux/subscriptionsStore';
import { renderPage } from 'helpers/rendering/render';
import { getQueryParameter } from 'helpers/urls/url';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import { getWeeklyFulfilmentOption } from '../../helpers/productCatalogToFulfilmentOption';
import ThankYouContent from './components/thankYou';
import WeeklyCheckoutForm from './components/weeklyCheckoutForm';
import WeeklyCheckoutFormGifting from './components/weeklyCheckoutFormGifting';

// ----- Redux Store ----- //
const initialBillingPeriod =
	toRegularBillingPeriod(getQueryParameter('period')) ?? BillingPeriod.Monthly;
const startDate = formatMachineDate(getWeeklyDays()[0] as Date);

const store = initReduxForSubscriptions(
	GuardianWeekly,
	initialBillingPeriod,
	startDate,
	NoProductOptions,
	getWeeklyFulfilmentOption,
);

setUpTrackingAndConsents(store.getState().common.abParticipations);

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
renderPage(content);
