// ----- Imports ----- //
import { Provider } from 'react-redux';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import HeadingBlock from 'components/headingBlock/headingBlock';
import Page from 'components/page/page';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { initReduxForSubscriptions } from 'helpers/redux/subscriptionsStore';
import { renderPage } from 'helpers/rendering/render';
import ThankYouContent from './components/thankYou/hero';
import ThankYouExistingContent from './thankYouExistingContent';
import 'stylesheets/skeleton/skeleton.scss';
import './digitalSubscriptionCheckout.scss';

setUpTrackingAndConsents();
// ----- Redux Store ----- //
const store = initReduxForSubscriptions();
const { countryGroupId } = store.getState().common.internationalisation;
// ----- Render ----- //
const content = (
	<Provider store={store}>
		<Page
			header={<Header countryGroupId={countryGroupId} />}
			footer={
				<Footer termsConditionsLink="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions" />
			}
		>
			<div className="thank-you-stage">
				<HeroWrapper appearance="custom">
					<ThankYouContent countryGroupId={countryGroupId} />
					<HeadingBlock>
						You already have an active digital subscription
					</HeadingBlock>
				</HeroWrapper>
				<ThankYouExistingContent countryGroupId={countryGroupId} />
				<ReturnSection subscriptionProduct="DigitalPack" />
			</div>
		</Page>
	</Provider>
);
renderPage(content, 'digital-subscription-checkout-page');
