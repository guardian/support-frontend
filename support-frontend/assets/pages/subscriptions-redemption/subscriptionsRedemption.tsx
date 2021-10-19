import React from 'react';
import { Provider } from 'react-redux';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import Page from 'components/page/page';
import { initRedux, setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import 'stylesheets/skeleton/skeleton.scss';
import ThankYouPendingContent from 'pages/digital-subscription-checkout/thankYouPendingContent';
import RedemptionForm from 'pages/subscriptions-redemption/components/redemptionForm';
import ThankYouContent from 'pages/subscriptions-redemption/thankYouContainer';
import CheckoutStage from './components/stage';
import MarketingConsent from './marketingConsentContainer';
import reducer from './subscriptionsRedemptionReducer';

setUpTrackingAndConsents();
// ----- Redux Store ----- //
const store = initRedux(reducer, true);
const state = store.getState();
const { countryGroupId } = state.common.internationalisation;
const thankyouProps = {
	countryGroupId,
	marketingConsent: <MarketingConsent />,
};
// ----- Render ----- //
const content = (
	<Provider store={store}>
		<Page
			header={<Header display="guardianLogo" countryGroupId="GBPCountries" />}
			footer={
				<Footer termsConditionsLink="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions" />
			}
		>
			<CheckoutStage
				checkoutForm={<RedemptionForm />}
				thankYouContentPending={
					<ThankYouPendingContent
						includePaymentCopy={false}
						{...thankyouProps}
					/>
				}
				thankYouContent={<ThankYouContent {...thankyouProps} />}
			/>
		</Page>
	</Provider>
);
renderPage(content, 'subscriptions-redemption-page');
