// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, headline, space, textSans } from '@guardian/source-foundations';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Asyncronously from 'components/asyncronously/asyncronously';
import Content from 'components/content/contentSimple';
import HeadingBlock from 'components/headingBlock/headingBlock';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import styles from 'components/subscriptionCheckouts/thankYou/thankYou.module.scss';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import 'helpers/internationalisation/countryGroup';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { myAccountUrl } from 'helpers/urls/externalLinks';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getTitle } from 'pages/paper-subscription-landing/helpers/products';
import AppsSection from './appsSection';
import { HeroPicture } from './heroPicture';
import SubscriptionsSurvey from './subscriptionSurvey';

// ----- Map State/Props ----- //
function mapStateToProps(state: WithDeliveryCheckoutState) {
	return { ...getFormFields(state) };
}

const connector = connect(mapStateToProps);

type PropTypes = ConnectedProps<typeof connector> & {
	isPending: boolean;
	countryGroupId: CountryGroupId;
};

// ----- Component ----- //
const subHeading = css`
	${headline.xxsmall({
		fontWeight: 'bold',
		lineHeight: 'loose',
	})};
	&:not(:last-of-type) {
		margin-bottom: ${space[2]}px;
	}
`;

const sansText = css`
	${textSans.medium({
		lineHeight: 'regular',
	})};
	${from.desktop} {
		${textSans.medium({
			lineHeight: 'loose',
		})};
	}
`;

const maxWidth = css`
	${from.tablet} {
		max-width: 70%;
	}

	${from.leftCol} {
		max-width: 60%;
	}
`;

const listStyle = css`
	position: relative;
	list-style: none;
	counter-increment: step-counter;
	margin-bottom: ${space[3]}px;
	padding-left: ${space[5]}px;
	:before {
		position: absolute;
		top: 0;
		left: 0;
		font-weight: 700;
		content: counter(step-counter) '.';
	}
	${textSans.medium({
		lineHeight: 'regular',
	})}
	${from.desktop} {
		${textSans.medium({
			lineHeight: 'loose',
		})}
	}
`;

const heroPictureHack = css`
	.component-grid-picture {
		left: 0;
	}
`;

const whatNextText: Partial<Record<FulfilmentOptions, string[]>> = {
	[HomeDelivery]: [
		'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future. As well as future communications on how  to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.',
		'Your newspaper will be delivered to your door.',
	],
	[Collection]: [
		`Keep an eye on your inbox. You should receive an email confirming the details of your subscription,
      and another email shortly afterwards that contains details of how you can pick up your newspapers from tomorrow.`,
		`You will receive your Subscription Card in your subscriber pack in the post, along with your home
      delivery letter.`,
		`Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or
      arrange a home delivery using your delivery letter.`,
	],
};

function WhatNext(fulfilmentOption: FulfilmentOptions) {
	const textItems = whatNextText[fulfilmentOption];
	return (
		<div css={space}>
			<h3 css={subHeading}>What happens next?</h3>
			<p css={maxWidth}>
				<ol>
					{textItems?.map((item) => (
						<li css={listStyle}>{item}</li>
					))}
				</ol>
			</p>
		</div>
	);
}

function MyAccountLink() {
	return (
		<a
			href={myAccountUrl}
			onClick={sendTrackingEventsOnClick({
				id: 'checkout_my_account',
				product: 'Paper',
				componentType: 'ACQUISITIONS_BUTTON',
			})}
		>
			MyAccount
		</a>
	);
}

function ThankYouContent({
	fulfilmentOption,
	productOption,
	startDate,
	isPending,
	countryGroupId,
}: PropTypes) {
	const hideStartDate = fulfilmentOption === Collection;
	const cleanProductOption = getTitle(productOption);
	const hasAddedDigitalSubscription = productOption.includes('Plus');
	const showTopContentBlock = isPending || (startDate && !hideStartDate);
	const packageName = `${cleanProductOption} ${
		!hasAddedDigitalSubscription ? 'package ' : ''
	}`;
	return (
		<div className="thank-you-stage">
			<HeroWrapper appearance="custom" className={styles.hero}>
				<div css={heroPictureHack}>
					<HeroPicture />
				</div>
				<HeadingBlock
					overheading="Thank you for supporting our journalism!"
					overheadingClass="--thankyou"
				>
					{isPending
						? `Your subscription to the ${packageName}is being processed`
						: `You have now subscribed to the ${packageName}`}
				</HeadingBlock>
			</HeroWrapper>
			{showTopContentBlock && (
				<Content divider>
					{isPending && (
						<p css={subHeading}>
							Your subscription is being processed and you will receive an email
							when it goes live.
						</p>
					)}
					{startDate && !hideStartDate && (
						<p css={subHeading}>
							<span>You will receive your newspapers from</span>
							<span> {formatUserDate(new Date(startDate))}</span>
						</p>
					)}
				</Content>
			)}
			<Content divider={!showTopContentBlock}>
				{WhatNext(fulfilmentOption)}
			</Content>
			{hasAddedDigitalSubscription && (
				<Content>
					<AppsSection countryGroupId={countryGroupId} />
					<p css={sansText}>
						To see your subscription go to <MyAccountLink />.
					</p>
				</Content>
			)}
			<SubscriptionsSurvey />
			<Content>
				<Asyncronously
					loader={import('components/marketingConsent/marketingConsentPaper')}
					render={(MktConsent) => (
						<MktConsent requestPending={false} error={false} />
					)}
				/>
			</Content>
		</div>
	);
}

// ----- Export ----- //
export default connector(ThankYouContent);
