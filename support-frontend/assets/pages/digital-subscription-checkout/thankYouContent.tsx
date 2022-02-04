// ----- Imports ----- //
import * as React from 'react';
import Content from 'components/content/content';
import HeadingBlock from 'components/headingBlock/headingBlock';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { SubscriptionsSurvey } from 'components/subscriptionCheckouts/subscriptionsSurvey/SubscriptionsSurvey';
import Text, { LargeParagraph } from 'components/text/text';
import type { Participations } from 'helpers/abTests/abtest';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getPromotions, userIsPatron } from 'helpers/patrons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
import AppsSection from './components/thankYou/appsSection';
import EventsModule from './components/thankYou/eventsModule';
import ThankYouHero from './components/thankYou/hero';
import 'helpers/abTests/abtest';

// ----- Types ----- //
export type PropTypes = {
	countryGroupId: CountryGroupId;
	paymentMethod: Option<PaymentMethod>;
	marketingConsent: React.ReactNode;
	includePaymentCopy: boolean;
	participations?: Option<Participations>;
	productPrices?: ProductPrices;
	currencyId?: IsoCurrency;
};

// ----- Component ----- //
const getEmailCopy = (
	paymentMethod: Option<PaymentMethod>,
	includePaymentCopy: boolean,
	isPatron?: boolean,
) => {
	if (isPatron) {
		return 'Thank you for subscribing to the Digital Subscription. We’ll send you an email with everything you need to know.  You’ll also receive future communications from us on how to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.';
	} else if (paymentMethod === DirectDebit) {
		return "Look out for an email within three business days confirming your recurring payment. Your first payment will be taken in 14 days and will appear as 'Guardian Media Group' on your bank statement. You’ll also receive future communications from us on how to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.";
	} else if (includePaymentCopy) {
		return 'We have sent you an email with everything you need to know. Your first payment will be taken in 14 days. You’ll also receive future communications from us on how to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.';
	}

	return 'We have sent you an email with everything you need to know. You’ll also receive future communications from us on how to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.';
};

function ThankYouContent(props: PropTypes): JSX.Element {
	const showEventsContent =
		props.participations &&
		props.participations.emailDigiSubEventsTest === 'variant';

	const isPatron: boolean = userIsPatron(
		getPromotions(props.countryGroupId, props.productPrices, props.currencyId),
	);

	return (
		<div className="thank-you-stage">
			<ThankYouHero countryGroupId={props.countryGroupId} />
			<HeroWrapper appearance="custom">
				<HeadingBlock>Your Digital Subscription is now live</HeadingBlock>
			</HeroWrapper>
			<Content>
				<Text>
					<LargeParagraph>
						{getEmailCopy(
							props.paymentMethod,
							props.includePaymentCopy,
							isPatron,
						)}
					</LargeParagraph>
				</Text>
			</Content>
			<Content>
				<Text title="Can&#39;t wait to get started?">
					<LargeParagraph>
						{`Just download the apps and log in with your Guardian account details${
							showEventsContent
								? ', or start browsing our Guardian digital events programmes.'
								: '.'
						}`}
					</LargeParagraph>
				</Text>
				<AppsSection countryGroupId={props.countryGroupId} />
				{showEventsContent && <EventsModule />}
			</Content>
			{props.includePaymentCopy ? (
				<SubscriptionsSurvey product={DigitalPack} />
			) : null}
			<Content>{props.marketingConsent}</Content>
		</div>
	);
}

ThankYouContent.defaultProps = {
	participations: null,
};

export default ThankYouContent;
