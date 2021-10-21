// ----- Imports ----- //
// @ts-expect-error - required for hooks
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import ProgressMessage from 'components/progressMessage/progressMessage';
import SecureTransactionIndicator from 'components/secureTransactionIndicator/secureTransactionIndicator';
import ContributionTicker from 'components/ticker/contributionTicker';
import { isInSupportAgainHeaderVariant } from 'helpers/abTests/lpPreviousGiving';
import { getCampaignSettings } from 'helpers/campaigns/campaigns';
import { useLastOneOffContribution } from 'helpers/customHooks/useLastOneOffContribution';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { State } from '../contributionsLandingReducer';
import '../contributionsLandingReducer';
import { ContributionsArticleCountWithOptOut } from './ContributionArticleCount';
import ContributionForm from './ContributionForm';
import { ContributionFormBlurb } from './ContributionFormBlurb';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
	setTickerGoalReached,
} from '../contributionsLandingActions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
	PreviousGivingBodyCopy,
	PreviousGivingHeaderCopy,
} from './ContributionsFormBlurbPreviousGiving';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { glyph } from 'helpers/internationalisation/currency';
import { get, remove, set } from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';
// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
	paymentComplete: boolean;
	countryGroupId: CountryGroupId;
	thankYouRoute: string;
	setPaymentIsWaiting: (arg0: boolean) => void;
	onThirdPartyPaymentAuthorised: (arg0: PaymentAuthorisation) => void;
	setTickerGoalReached: () => void;
	tickerGoalReached: boolean;
	campaignCodeParameter: string | null | undefined;
	isReturningContributor: boolean;
	countryId: IsoCountry;
	userName: string | null;
	referrerAcquisitionData: ReferrerAcquisitionData;
	canShowTicker: boolean;
	currency: IsoCurrency;
	articleCountAbTestVariant: boolean;
};

/* eslint-enable react/no-unused-prop-types */
const mapStateToProps = (state: State) => ({
	paymentComplete: state.page.form.paymentComplete,
	countryGroupId: state.common.internationalisation.countryGroupId,
	tickerGoalReached: state.page.form.tickerGoalReached,
	isReturningContributor: state.page.user.isReturningContributor,
	countryId: state.common.internationalisation.countryId,
	userName: state.page.user.firstName,
	referrerAcquisitionData: state.common.referrerAcquisitionData,
	canShowTicker: state.common.abParticipations.tickerTest === 'variant',
	currency: state.common.internationalisation.currencyId,
	articleCountAbTestVariant:
		state.common.abParticipations.articleCountTest === 'variant',
});

const mapDispatchToProps = (dispatch: (...args: any[]) => any) => ({
	setPaymentIsWaiting: (isWaiting) => {
		dispatch(paymentWaiting(isWaiting));
	},
	setTickerGoalReached: () => {
		dispatch(setTickerGoalReached());
	},
	onThirdPartyPaymentAuthorised: (token) => {
		dispatch(onThirdPartyPaymentAuthorised(token));
	},
});

// ----- Functions ----- //
export type CountryMetaData = {
	headerCopy: string;
	contributeCopy?: React.ReactElement<React.ComponentProps<string>, string>;
	// Optional message to display at the top of the form
	formMessage?: React.ReactElement<React.ComponentProps<string>, string>;
};
const defaultHeaderCopy =
	'Support\xa0our\njournalism\xa0with\na\xa0contribution\nof\xa0any\xa0size';
const defaultContributeCopy = (
	<span>
		Your support helps protect the Guardian’s independence and it means we can
		keep delivering quality journalism that’s open for everyone around the
		world.
		<span className="gu-content__blurb-blurb-last-sentence">
			{' '}
			Every contribution, however big or small, is so valuable for our future.
		</span>
	</span>
);

const articleCountContributeCopy = (currency) => (
	<span>
		Thank you for turning to the Guardian on so many occasions. Show your
		support for our open, fiercely independent journalism today with a
		contribution of any size. Every {currency}1 we receive is so valuable for
		our future.
	</span>
);

const defaultHeaderCopyAndContributeCopy: CountryMetaData = {
	headerCopy: defaultHeaderCopy,
	contributeCopy: defaultContributeCopy,
};
// ----- Render ----- //
type ArticleCountOptOut = {
	hasOptedOut: boolean;
	onArticleCountOptOut: () => void;
	onArticleCountOptIn: () => void;
};
const ARTICLE_COUNT_OPT_OUT_COOKIE = {
	name: 'gu_article_count_opt_out',
	daysToLive: 90,
};
export const addArticleCountOptOutCookie = (): void =>
	set(
		ARTICLE_COUNT_OPT_OUT_COOKIE.name,
		new Date().getTime().toString(),
		ARTICLE_COUNT_OPT_OUT_COOKIE.daysToLive,
	);
export const removeArticleCountOptOutCookie = (): void =>
	remove(ARTICLE_COUNT_OPT_OUT_COOKIE.name);
export const hasArticleCountOptOutCookie = (): boolean =>
	!!get(ARTICLE_COUNT_OPT_OUT_COOKIE.name);
export function useArticleCountOptOut(): ArticleCountOptOut {
	const [hasOptedOut, setHasOptedOut] = useState(hasArticleCountOptOutCookie());

	function onArticleCountOptOut() {
		setHasOptedOut(true);
		addArticleCountOptOutCookie();
	}

	function onArticleCountOptIn() {
		setHasOptedOut(false);
		removeArticleCountOptOutCookie();
	}

	return {
		hasOptedOut,
		onArticleCountOptOut,
		onArticleCountOptIn,
	};
}

const getArticleCountFromUrl = (): number | null => {
	const articleCount = getQueryParameter('numArticles');

	if (articleCount) {
		return parseInt(articleCount, 10);
	}

	return null;
};

function withProps(props: PropTypes) {
	const campaignSettings = getCampaignSettings();
	const campaignCopy =
		campaignSettings && campaignSettings.copy
			? campaignSettings.copy(props.tickerGoalReached)
			: null;

	const onPaymentAuthorisation = (
		paymentAuthorisation: PaymentAuthorisation,
	) => {
		props.setPaymentIsWaiting(true);
		props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
	};

	const countryGroupDetails = {
		...defaultHeaderCopyAndContributeCopy,
		...(campaignCopy || {}),
	};

	if (props.paymentComplete) {
		// We deliberately allow the redirect to REPLACE rather than PUSH /thankyou onto the history stack.
		// This is because going 'back' to the /contribute page is not helpful, and the client-side routing would redirect
		// back to /thankyou given the current state of the redux store.
		// The effect is that clicking back in the browser will take the user to the page before they arrived at /contribute
		return <Redirect to={props.thankYouRoute} push={false} />;
	}

	if (props.campaignCodeParameter && !campaignSettings) {
		// A campaign code was supplied in the url path, but it's not a valid campaign
		return (
			<Redirect
				to={`/${
					countryGroups[props.countryGroupId].supportInternationalisationId
				}/contribute`}
				push={false}
			/>
		);
	}

	const showPreviousGiving = isInSupportAgainHeaderVariant(
		props.referrerAcquisitionData,
	);
	const lastOneOffContribution = useLastOneOffContribution();
	const numArticles = getArticleCountFromUrl();
	const { hasOptedOut, onArticleCountOptIn, onArticleCountOptOut } =
		useArticleCountOptOut();
	const isArticleCountTest = props.articleCountAbTestVariant;
	return (
		<div className="gu-content__content gu-content__content-contributions gu-content__content--flex">
			{!isArticleCountTest && showPreviousGiving && lastOneOffContribution && (
				<ContributionFormBlurb
					headerCopy={<PreviousGivingHeaderCopy userName={props.userName} />}
					bodyCopy={
						<PreviousGivingBodyCopy
							lastOneOffContribution={lastOneOffContribution}
						/>
					}
				/>
			)}

			{isArticleCountTest && numArticles !== null && numArticles >= 5 ? (
				<ContributionFormBlurb
					headerCopy={
						<ContributionsArticleCountWithOptOut
							numArticles={numArticles}
							isArticleCountOn={!hasOptedOut}
							isMobileOnly={false}
							onArticleCountOptOut={onArticleCountOptOut}
							onArticleCountOptIn={onArticleCountOptIn}
							defaultHeaderCopy={countryGroupDetails.headerCopy}
							userName={props.userName}
						/>
					}
					bodyCopy={articleCountContributeCopy(glyph(props.currency))}
				/>
			) : (
				<ContributionFormBlurb
					headerCopy={countryGroupDetails.headerCopy}
					bodyCopy={countryGroupDetails.contributeCopy}
				/>
			)}

			<div className="gu-content__form">
				{isArticleCountTest && numArticles !== null && numArticles >= 5 && (
					<ContributionsArticleCountWithOptOut
						numArticles={numArticles}
						isMobileOnly
						isArticleCountOn={!hasOptedOut}
						onArticleCountOptOut={onArticleCountOptOut}
						onArticleCountOptIn={onArticleCountOptIn}
						userName={null}
						defaultHeaderCopy={null}
					/>
				)}

				<SecureTransactionIndicator modifierClasses={['top']} />

				{props.canShowTicker &&
				campaignSettings &&
				campaignSettings.tickerSettings ? (
					<ContributionTicker
						{...campaignSettings.tickerSettings}
						onGoalReached={props.setTickerGoalReached}
					/>
				) : null}
				{props.tickerGoalReached &&
				campaignSettings &&
				campaignSettings.tickerSettings &&
				campaignSettings.goalReachedCopy ? (
					campaignSettings.goalReachedCopy
				) : (
					<div>
						{countryGroupDetails.formMessage ? (
							<div className="form-message">
								{countryGroupDetails.formMessage}
							</div>
						) : null}

						<ContributionForm
							onPaymentAuthorisation={onPaymentAuthorisation}
							campaignSettings={campaignSettings}
						/>
					</div>
				)}
			</div>
			{campaignSettings && campaignSettings.extraComponent}
			<DirectDebitPopUpForm
				buttonText="Contribute with Direct Debit"
				onPaymentAuthorisation={onPaymentAuthorisation}
			/>
		</div>
	);
}

function withoutProps() {
	return (
		<div className="gu-content__content gu-content__content-contributions gu-content__content--flex">
			<ContributionFormBlurb
				headerCopy={defaultHeaderCopy}
				bodyCopy={defaultContributeCopy}
			/>

			<div className="gu-content__form gu-content__form-ssr">
				<SecureTransactionIndicator modifierClasses={['top']} />
				<ProgressMessage message={['Loading the page']} />
			</div>
		</div>
	);
}

export const ContributionFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(withProps);
export const EmptyContributionFormContainer = withoutProps;
