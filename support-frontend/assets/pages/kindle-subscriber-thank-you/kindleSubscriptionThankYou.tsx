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
import { getAmount } from 'helpers/contributions';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import {
	OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN,
	trackUserData,
} from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { sendEventContributionCheckoutConversion } from 'helpers/tracking/quantumMetric';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';
import {
	buttonContainer,
	checkoutContainer,
	columnContainer,
	firstColumnContainer,
	headerContainer,
	isLargeDonation,
} from 'pages/supporter-plus-thank-you/supporterPlusThankYou';
import ThankYouHeader from './components/thankYouHeader';

export function KindleSubscriptionThankYou(): JSX.Element {
	const campaignSettings = useMemo<CampaignSettings | null>(
		() => getCampaignSettings(campaignCode),
		[],
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
	const { selectedAmounts, otherAmounts, billingPeriod } =
		useContributionsSelector((state) => state.page.checkoutForm.product);
	const { isSignedIn } = useContributionsSelector((state) => state.page.user);
	const contributionType = useContributionsSelector(getContributionType);
	const isNewAccount = userTypeFromIdentityResponse === 'new';
	const amount = getAmount(selectedAmounts, otherAmounts, contributionType);
	const isAmountLargeDonation = amount
		? isLargeDonation(amount, contributionType, paymentMethod)
		: false;

	useEffect(() => {
		// TO-DO
		if (amount) {
			sendEventContributionCheckoutConversion(
				amount,
				contributionType,
				currencyId,
			);

			trackUserData(
				paymentMethod,
				contributionType,
				isSignedIn,
				!isNewAccount,
				isAmountLargeDonation,
			);
		}
	}, []);

	const thankYouModuleData = getThankYouModuleData(
		countryId,
		countryGroupId,
		campaignSettings?.createReferralCodes ?? false,
		csrf,
		email,
		campaignSettings?.campaignCode,
	);

	const maybeThankYouModule = (
		condtion: boolean,
		moduleType: ThankYouModuleType,
	): ThankYouModuleType[] => (condtion ? [moduleType] : []);

	// NB: We do not show marketing consent or support reminder modules for recurring
	const thankYouModules: ThankYouModuleType[] = [
		...maybeThankYouModule(isNewAccount, 'signUp'),
		...maybeThankYouModule(
			!isNewAccount && !isSignedIn && email.length > 0,
			'signIn',
		),
		// Disable App Download module
		// ...maybeThankYouModule(amountIsAboveThreshold, 'appDownload'),
		// Disable Feedback module
		// 'feedback',
		...maybeThankYouModule(countryId === 'AU', 'ausMap'),
		'socialShare',
	];

	const firstColumn = thankYouModules.slice(0, 1);
	const secondColumn = thankYouModules.slice(1);

	return (
		<PageScaffold
			id="supporter-plus-thank-you"
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
							billingPeriod={billingPeriod}
							amount={amount}
							currency={currencyId}
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
