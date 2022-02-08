// ----- Imports ----- //
import { Provider } from 'react-redux';
import Footer from 'components/footerCompliant/Footer';
import Page from 'components/page/page';
import HeaderWrapper from 'components/subscriptionCheckouts/headerWrapper';
import CheckoutStage from 'components/subscriptionCheckouts/stage';
import type { CommonState } from 'helpers/page/commonReducer';
import { initRedux, setUpTrackingAndConsents } from 'helpers/page/page';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import { Paper } from 'helpers/productPrice/subscriptions';
import { renderPage } from 'helpers/rendering/render';
import 'stylesheets/skeleton/skeleton.scss';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import CheckoutForm from 'pages/paper-subscription-checkout/components/paperCheckoutForm';
import ThankYouContent from './components/thankYou';
import './_legacyImports.scss';
import {
	getFulfilmentOption,
	getProductOption,
	getStartDate,
} from 'pages/paper-subscription-checkout/helpers/options';
import { FocusStyleManager } from '@guardian/src-utilities';

setUpTrackingAndConsents();
// ----- Redux Store ----- //
const fulfilmentOption = getFulfilmentOption();
const productOption = getProductOption();
const startDate = getStartDate(fulfilmentOption, productOption);

const reducer = (commonState: CommonState) =>
	createWithDeliveryCheckoutReducer(
		commonState.internationalisation.countryId,
		Paper,
		Monthly,
		startDate,
		productOption,
		fulfilmentOption,
	);

const store = initRedux(reducer, true);
const { countryGroupId } = store.getState().common.internationalisation;
FocusStyleManager.onlyShowFocusOnTabs();
// ----- Render ----- //
const content = (
	<Provider store={store}>
		<Page
			header={<HeaderWrapper />}
			footer={
				<Footer termsConditionsLink="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions">
					<p>
						By proceeding, you agree to our{' '}
						<a href="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions">
							Terms &amp; Conditions
						</a>
						. We will share your contact and subscription details with our
						fulfilment partners to provide you with your subscription card. To
						find out more about what personal data we collect and how we use it,
						please visit our{' '}
						<a href="https://www.theguardian.com/help/privacy-policy">
							Privacy&nbsp;Policy
						</a>
						.
					</p>
				</Footer>
			}
		>
			<CheckoutStage
				checkoutForm={<CheckoutForm />}
				thankYouContentPending={
					<ThankYouContent isPending countryGroupId={countryGroupId} />
				}
				thankYouContent={
					<ThankYouContent isPending={false} countryGroupId={countryGroupId} />
				}
				subscriptionProduct="Paper"
			/>
		</Page>
	</Provider>
);
renderPage(content, 'paper-subscription-checkout-page');
