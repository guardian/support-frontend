import { css } from '@emotion/react';
import { between, from, space, sport } from '@guardian/source-foundations';
import { Column, Columns, LinkButton } from '@guardian/source-react-components';
import { FooterWithContents } from '@guardian/source-react-components-development-kitchen';
import { useEffect, useMemo } from 'preact/hooks';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import { PageScaffold } from 'components/page/pageScaffold';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import { getThankYouModuleData } from 'components/thankYou/thankYouModuleData';
import type { CampaignSettings } from 'helpers/campaigns/campaigns';
import { getCampaignSettings } from 'helpers/campaigns/campaigns';
import type { ContributionType } from 'helpers/contributions';
import { getAmount, isContributionsOnlyCountry } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit, PayPal } from 'helpers/forms/paymentMethods';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { getPromotion } from 'helpers/productPrice/promotions';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { setOneOffContributionCookie } from 'helpers/storage/contributionsCookies';
import { getSession } from 'helpers/storage/storage';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import {
	OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN,
	trackUserData,
} from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { successfulContributionConversion } from 'helpers/tracking/googleTagManager';
import { pageView } from 'helpers/tracking/ophan';
import { sendEventContributionCheckoutConversion } from 'helpers/tracking/quantumMetric';
import { getAbsoluteURL } from 'helpers/urls/url';
import ThankYouFooter from './components/thankYouFooter';
import ThankYouHeader from './components/thankYouHeader/thankYouHeader';

export const checkoutContainer = css`
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;

export const columnContainer = css`
	> *:not(:last-child) {
		${from.tablet} {
			margin-bottom: ${space[6]}px;
		}

		${from.desktop} {
			margin-bottom: ${space[5]}px;
		}
	}
`;

export const firstColumnContainer = css`
	${between.tablet.and.desktop} {
		margin-bottom: ${space[6]}px;
	}
`;

export const headerContainer = css`
	${from.desktop} {
		width: 60%;
	}
	${from.leftCol} {
		width: calc(50% - ${space[3]}px);
	}
`;

export const buttonContainer = css`
	padding: ${space[12]}px 0;
`;

export function getAmountFromSessionStorage(): number | undefined {
	const amount = getSession('contributionAmount');

	if (amount) {
		return parseFloat(amount);
	}
}

export const largeDonations: Record<ContributionType, number> = {
	MONTHLY: 20,
	ANNUAL: 100,
	ONE_OFF: 100,
};

export const isLargeDonation = (
	amount: number,
	contributionType: ContributionType,
	paymentMethod: PaymentMethod,
): boolean => {
	if (paymentMethod === PayPal && contributionType === 'ONE_OFF') {
		// We do not have the amount after the redirect
		return false;
	}

	return amount >= largeDonations[contributionType];
};

export type SupporterPlusThankYouProps = {
	overideThresholdPrice?: number;
};

export function SupporterPlusThankYou({
	overideThresholdPrice,
}: SupporterPlusThankYouProps): JSX.Element {
	const campaignSettings = useMemo<CampaignSettings | null>(
		() => getCampaignSettings(campaignCode),
		[],
	);
	const { abParticipations, amounts } = useContributionsSelector(
		(state) => state.common,
	);
	const { countryId, countryGroupId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { csrf } = useContributionsSelector((state) => state.page.checkoutForm);
	const { campaignCode } = useContributionsSelector(
		(state) => state.common.referrerAcquisitionData,
	);
	const { firstName, email, userTypeFromIdentityResponse } =
		useContributionsSelector(
			(state) => state.page.checkoutForm.personalDetails,
		);
	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod.name,
	);
	const {
		selectedAmounts,
		otherAmounts,
		billingPeriod,
		fulfilmentOption,
		productOption,
		productPrices,
	} = useContributionsSelector((state) => state.page.checkoutForm.product);
	const { isSignedIn } = useContributionsSelector((state) => state.page.user);
	const contributionType = useContributionsSelector(getContributionType);
	const isNewAccount = userTypeFromIdentityResponse === 'new';
	const isOneOffPayPal =
		paymentMethod === PayPal && contributionType === 'ONE_OFF';
	const isOneOff = contributionType === 'ONE_OFF';
	const amount =
		getAmountFromSessionStorage() ??
		getAmount(selectedAmounts, otherAmounts, contributionType);
	const isAmountLargeDonation = amount
		? isLargeDonation(amount, contributionType, paymentMethod)
		: false;

	/**
	 * thankyou stories do not have access to the productCatalog thresholdPrice from Zuora
	 * overideThresholdPrice allows thankyou stories to provide their own thresholdPrice
	 * without it ever appearing in the actual thankyou page
	 */
	const thresholdPrice =
		overideThresholdPrice ??
		useContributionsSelector((state) =>
			getThresholdPrice(contributionType, state),
		);

	/**
	 * We would normally use the isSuporterPlusFromState selector here,
	 * but the amount can actually come from `localStorage`.
	 *
	 * We should clear this up when refactoring
	 */
	const isSupporterPlus =
		contributionType !== 'ONE_OFF' &&
		!isContributionsOnlyCountry(amounts) &&
		thresholdPrice
			? amount >= thresholdPrice
			: false;

	/**
	 * We only support SupporterPlus for now.
	 *
	 * This is an edgecase we see if the promoCode gets passed through to the thank you page.
	 * We have not found the route where this happens - this is a hack.
	 */
	const promotion = isSupporterPlus
		? getPromotion(
				productPrices,
				countryId,
				billingPeriod,
				fulfilmentOption,
				productOption,
		  )
		: undefined;

	useEffect(() => {
		if (amount) {
			// track conversion with GTM
			successfulContributionConversion(
				amount,
				contributionType,
				currencyId,
				paymentMethod,
			);
			// track conversion with QM
			sendEventContributionCheckoutConversion(
				amount,
				contributionType,
				currencyId,
			);
		}

		trackUserData(
			paymentMethod,
			contributionType,
			isSignedIn,
			!isNewAccount,
			isAmountLargeDonation,
		);

		/**
		 *  The TY page is client side routed for all Contributions
		 * 	apart from Single paid with Paypal. For client side routed pages we
		 * 	manually fire an Ophan pageView.
		 **/
		if (!isOneOffPayPal) {
			const internationalisationIDValue =
				countryGroups[countryGroupId].supportInternationalisationId;

			pageView(
				document.location.href,
				getAbsoluteURL(`/${internationalisationIDValue}/contribute`),
			);
		}

		if (contributionType === 'ONE_OFF') {
			setOneOffContributionCookie();
		}
	}, []);

	const amountIsAboveThreshold = !!(thresholdPrice && amount >= thresholdPrice);

	const { feedbackSurveyHasBeenCompleted, supportReminder } =
		useContributionsSelector((state) => state.page.checkoutForm.thankYou);
	const thankYouModuleData = getThankYouModuleData(
		countryId,
		countryGroupId,
		csrf,
		email,
		isOneOff,
		amountIsAboveThreshold,
		supportReminder,
		feedbackSurveyHasBeenCompleted,
		campaignSettings?.campaignCode,
	);

	const maybeThankYouModule = (
		condtion: boolean,
		moduleType: ThankYouModuleType,
	): ThankYouModuleType[] => (condtion ? [moduleType] : []);

	const thankYouModules: ThankYouModuleType[] = [
		...maybeThankYouModule(isNewAccount, 'signUp'),
		...maybeThankYouModule(
			!isNewAccount && !isSignedIn && email.length > 0,
			'signIn',
		),
		...maybeThankYouModule(
			contributionType !== 'ONE_OFF' && isSupporterPlus,
			'appDownload',
		),
		...maybeThankYouModule(
			contributionType === 'ONE_OFF' && email.length > 0,
			'supportReminder',
		),
		...maybeThankYouModule(email.length > 0, 'feedback'),
		...maybeThankYouModule(countryId === 'AU', 'ausMap'),
		'socialShare',
	];

	const numberOfModulesInFirstColumn = thankYouModules.length >= 6 ? 3 : 2;
	const firstColumn = thankYouModules.slice(0, numberOfModulesInFirstColumn);
	const secondColumn = thankYouModules.slice(numberOfModulesInFirstColumn);

	const showOffer =
		!!abParticipations.usFreeBookOffer &&
		useContributionsSelector(isSupporterPlusFromState);

	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<ThankYouFooter />
				</FooterWithContents>
			}
		>
			<div css={checkoutContainer}>
				<Container>
					<div css={headerContainer}>
						<ThankYouHeader
							name={firstName}
							showDirectDebitMessage={paymentMethod === DirectDebit}
							isOneOffPayPal={isOneOffPayPal}
							contributionType={contributionType}
							amount={amount}
							currency={currencyId}
							amountIsAboveThreshold={isSupporterPlus}
							isSignedIn={isSignedIn}
							userTypeFromIdentityResponse={userTypeFromIdentityResponse}
							showOffer={showOffer}
							promotion={promotion}
						/>
					</div>

					<Columns collapseUntil="desktop">
						<Column cssOverrides={[columnContainer, firstColumnContainer]}>
							{firstColumn.map((moduleType) => (
								<ThankYouModule
									moduleType={moduleType}
									isSignedIn={isSignedIn}
									{...thankYouModuleData[moduleType]}
								/>
							))}
						</Column>
						<Column cssOverrides={columnContainer}>
							{secondColumn.map((moduleType) => (
								<ThankYouModule
									moduleType={moduleType}
									isSignedIn={isSignedIn}
									{...thankYouModuleData[moduleType]}
								/>
							))}
						</Column>
					</Columns>

					<div css={buttonContainer}>
						<LinkButton
							href="https://www.theguardian.com"
							priority="tertiary"
							onClick={() =>
								trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN)
							}
						>
							Return to the Guardian
						</LinkButton>
					</div>
				</Container>
			</div>
		</PageScaffold>
	);
}
