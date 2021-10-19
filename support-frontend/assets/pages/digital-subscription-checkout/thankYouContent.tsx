// ----- Imports ----- //
import * as React from 'react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';
import AppsSection from './components/thankYou/appsSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ThankYouHero from './components/thankYou/hero';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { Option } from 'helpers/types/option';
import { SubscriptionsSurvey } from 'components/subscriptionCheckouts/subscriptionsSurvey/SubscriptionsSurvey';
import EventsModule from './components/thankYou/eventsModule';
import type { Participations } from 'helpers/abTests/abtest';
import 'helpers/abTests/abtest';
// ----- Types ----- //
export type PropTypes = {
	countryGroupId: CountryGroupId;
	paymentMethod: Option<PaymentMethod>;
	marketingConsent: React.ReactNode;
	includePaymentCopy: boolean;
	participations?: Option<Participations>;
};

// ----- Component ----- //
const getEmailCopy = (
	paymentMethod: Option<PaymentMethod>,
	includePaymentCopy: boolean,
) => {
	if (paymentMethod === DirectDebit) {
		return "Look out for an email within three business days confirming your recurring payment. Your first payment will be taken in 14 days and will appear as 'Guardian Media Group' on your bank statement. You’ll also receive future communications from us on how to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.";
	} else if (includePaymentCopy) {
		return 'We have sent you an email with everything you need to know. Your first payment will be taken in 14 days. You’ll also receive future communications from us on how to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.';
	}

	return 'We have sent you an email with everything you need to know. You’ll also receive future communications from us on how to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.';
};

function ThankYouContent(props: PropTypes) {
	const showEventsContent =
		props.participations &&
		props.participations.emailDigiSubEventsTest === 'variant';
	return (
		<div className="thank-you-stage">
			<ThankYouHero countryGroupId={props.countryGroupId} />
			<HeroWrapper appearance="custom">
				<HeadingBlock>Your Digital Subscription is now live</HeadingBlock>
			</HeroWrapper>
			<Content>
				<Text>
					<LargeParagraph>
						{getEmailCopy(props.paymentMethod, props.includePaymentCopy)}
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
}; // ----- Export ----- //

export default ThankYouContent;
