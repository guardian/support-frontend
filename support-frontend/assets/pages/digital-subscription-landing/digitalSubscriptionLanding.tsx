// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, space } from '@guardian/source-foundations';
import { useEffect } from 'react';
// ----- Styles ----- //
import 'stylesheets/skeleton/skeleton.scss';
import { Provider } from 'react-redux';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import InteractiveTable from 'components/interactiveTable/interactiveTable';
import Block from 'components/page/block';
import Page from 'components/page/page';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import CheckoutStage from 'components/subscriptionCheckouts/stage';
import MarketingConsent from 'components/subscriptionCheckouts/thankYou/marketingConsentContainer';
import MarketingConsentGift from 'components/subscriptionCheckouts/thankYou/marketingConsentContainerGift';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import { showPayPal } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { getPromotions, userIsPatron } from 'helpers/patrons';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { initReduxForSubscriptions } from 'helpers/redux/subscriptionsStore';
import { renderPage } from 'helpers/rendering/render';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { routes } from 'helpers/urls/routes';
import ThankYouContent from 'pages/digital-subscription-checkout/thankYouContainer';
import ThankYouPendingContent from 'pages/digital-subscription-checkout/thankYouPendingContent';
import EventsModule from 'pages/digital-subscription-landing/components/events/eventsModule';
import FeedbackWidget from 'pages/digital-subscription-landing/components/feedbackWidget/feedbackWidget';
import { DigitalFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import {
	footer,
	getRows,
	headers,
} from './components/comparison/interactiveTableContents';
import { HeroWithImage } from './components/hero/heroWithImage';
import { HeroWithPriceCards } from './components/hero/heroWithPriceCards';
import { getHeroCtaProps } from './components/paymentSelection/helpers/paymentSelection';
import Prices from './components/prices';
import { digitalLandingProps } from './digitalSubscriptionLandingProps';
import type { DigitalLandingPropTypes } from './digitalSubscriptionLandingProps';

const eventsProductBlockContainer = css`
	margin-top: 43px;
	padding-top: 0;
	padding-bottom: 0;

	${from.tablet} {
		margin-top: ${space[12]}px;
	}
`;

const extraPaddingForComparisonTable = css`
	padding-top: ${space[6]}px;
`;

const interactiveTableContainer = css`
	position: relative;
	z-index: 1;
	margin-top: -40px;
	margin-bottom: ${space[2]}px;

	${from.tablet} {
		margin-bottom: ${space[6]}px;
	}
`;

const footerHackFix = css`
	.component-left-margin-section:before {
		content: none;
	}
	.component-content__content {
		max-width: unset;
	}
`;

// ----- Internationalisation ----- //
const reactElementId: Record<CountryGroupId, string> = {
	GBPCountries: 'digital-subscription-landing-page-uk',
	UnitedStates: 'digital-subscription-landing-page-us',
	AUDCountries: 'digital-subscription-landing-page-au',
	EURCountries: 'digital-subscription-landing-page-eu',
	NZDCountries: 'digital-subscription-landing-page-nz',
	Canada: 'digital-subscription-landing-page-ca',
	International: 'digital-subscription-landing-page-int',
};

const reducer = () => createReducer(null);

const store = initReduxForSubscriptions(DigitalPack, Monthly, reducer);
const { currencyId } = store.getState().common.internationalisation;
const { billingPeriod } = store.getState().page.checkoutForm.product;

// ----- Render ----- //
function DigitalLandingPage(props: DigitalLandingPropTypes) {
	const { productPrices, orderIsAGift, countryGroupId } = props;

	if (!productPrices) {
		return null;
	}

	useEffect(() => {
		showPayPal(store.dispatch);
	}, []);

	const path = orderIsAGift
		? routes.digitalSubscriptionLandingGift
		: routes.digitalSubscriptionLanding;
	const CountrySwitcherHeader = headerWithCountrySwitcherContainer({
		path,
		countryGroupId,
		listOfCountryGroups: [
			GBPCountries,
			UnitedStates,
			AUDCountries,
			EURCountries,
			NZDCountries,
			Canada,
			International,
		],
		trackProduct: 'DigitalPack',
	});

	const pageFooter = (
		<div css={footerHackFix} className="footer-container">
			<div className="footer-alignment">
				<DigitalFooter
					country={countryGroupId}
					orderIsAGift={orderIsAGift}
					productPrices={productPrices}
				/>
			</div>
		</div>
	);

	const thankyouProps = {
		countryGroupId: props.countryGroupId,
		marketingConsent: props.orderIsAGift ? (
			<MarketingConsentGift />
		) : (
			<MarketingConsent />
		),
		productPrices,
		billingPeriod: props.orderIsAGift ? billingPeriod : 'Annual',
		currencyId,
	};

	return (
		<Provider store={store}>
			<Page header={<CountrySwitcherHeader />} footer={pageFooter}>
				<CheckoutStage
					checkoutForm={<DigitalLandingComponent {...props} />}
					thankYouContentPending={
						<ThankYouPendingContent includePaymentCopy {...thankyouProps} />
					}
					thankYouContent={<ThankYouContent {...thankyouProps} />}
					subscriptionProduct={DigitalPack}
				/>
			</Page>
		</Provider>
	);
}

function DigitalLandingComponent({
	countryGroupId,
	currencyId,
	participations,
	productPrices,
	promotionCopy,
	orderIsAGift,
}: DigitalLandingPropTypes) {
	if (!productPrices) {
		return null;
	}

	const showEventsComponent =
		participations.emailDigiSubEventsTest === 'variant';
	const giftNonGiftLink = orderIsAGift
		? routes.digitalSubscriptionLanding
		: routes.digitalSubscriptionLandingGift;
	const sanitisedPromoCopy = getPromotionCopy(promotionCopy);

	const isPatron: boolean = userIsPatron(
		getPromotions(countryGroupId, productPrices, currencyId, billingPeriod),
	);

	// For comparison table
	const localisedRows = getRows(countryGroupId, isPatron);

	// For CTAs in hero test
	const heroPriceList = getHeroCtaProps(
		productPrices,
		currencyId,
		countryGroupId,
	);

	const [widgetShouldDisplay, setElementToObserve] = useHasBeenSeen({
		threshold: 0.3,
		debounce: true,
	});

	return (
		<span>
			{orderIsAGift ? (
				<HeroWithImage
					countryGroupId={countryGroupId}
					promotionCopy={sanitisedPromoCopy}
				/>
			) : (
				<HeroWithPriceCards
					promotionCopy={sanitisedPromoCopy}
					countryGroupId={countryGroupId}
					priceList={heroPriceList}
				/>
			)}
			<FullWidthContainer>
				<CentredContainer>
					<div css={interactiveTableContainer} ref={setElementToObserve}>
						<InteractiveTable
							caption={<>What&apos;s included in a paid digital subscription</>}
							headers={headers}
							rows={localisedRows}
							footer={!isPatron && !orderIsAGift && footer}
						/>
					</div>
				</CentredContainer>
			</FullWidthContainer>
			{showEventsComponent && (
				<FullWidthContainer>
					<CentredContainer>
						<Block cssOverrides={eventsProductBlockContainer}>
							<EventsModule />
						</Block>
					</CentredContainer>
				</FullWidthContainer>
			)}
			<FullWidthContainer theme="dark" hasOverlap>
				<CentredContainer>
					<Prices
						cssOverrides={[extraPaddingForComparisonTable]}
						countryGroupId={countryGroupId}
						currencyId={currencyId}
						productPrices={productPrices}
						orderIsAGift={orderIsAGift}
					/>
				</CentredContainer>
			</FullWidthContainer>
			<FullWidthContainer theme="white">
				<CentredContainer>
					<GiftNonGiftCta
						product="digital"
						href={giftNonGiftLink}
						orderIsAGift={orderIsAGift}
					/>
				</CentredContainer>
			</FullWidthContainer>
			<FeedbackWidget display={widgetShouldDisplay} />
		</span>
	);
}

setUpTrackingAndConsents();

const props = digitalLandingProps();

const content = <DigitalLandingPage {...props} />;

renderPage(content, reactElementId[props.countryGroupId]);
