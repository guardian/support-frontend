import { css } from '@emotion/react';
import {
	between,
	breakpoints,
	from,
	neutral,
	space,
	until,
} from '@guardian/source-foundations';
import { LinkButton } from '@guardian/source-react-components';
import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import type { CampaignSettings } from 'helpers/campaigns/campaigns';
import { getCampaignSettings } from 'helpers/campaigns/campaigns';
import type { ContributionType } from 'helpers/contributions';
import { getAmount } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit, PayPal } from 'helpers/forms/paymentMethods';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { User } from 'helpers/user/userReducer';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import { showBenefitsThankYouText as shouldShowBenefitsThankYouText } from '../DigiSubBenefits/helpers';
import ContributionThankYouAusMap from './ContributionThankYouAusMap';
import ContributionThankYouHeader from './ContributionThankYouHeader';
import ContributionThankYouMarketingConsent from './ContributionThankYouMarketingConsent';
import ContributionThankYouSignIn from './ContributionThankYouSignIn';
import ContributionThankYouSignUp from './ContributionThankYouSignUp';
import ContributionThankYouSocialShare from './ContributionThankYouSocialShare';
import ContributionThankYouSupportReminder from './ContributionThankYouSupportReminder';
import ContributionThankYouSurvey from './ContributionThankYouSurvey';
import {
	OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN,
	trackUserData,
} from './utils/ophan';

const container = css`
	background: white;
	padding: 0 ${space[3]}px;
	margin: 0 auto;

	${from.tablet} {
		background: none;
		max-width: ${breakpoints.tablet}px;
	}

	${from.desktop} {
		max-width: ${breakpoints.desktop}px;
	}

	${from.leftCol} {
		max-width: ${breakpoints.leftCol}px;
	}

	${from.wide} {
		max-width: ${breakpoints.wide}px;
	}
`;

const headerContainer = css`
	${from.desktop} {
		width: 60%;
	}
	${from.leftCol} {
		width: calc(50% - ${space[3]}px);
	}
`;

const columnsContainer = css`
	display: flex;
	flex-direction: column;

	${until.tablet} {
		border-top: 1px solid ${neutral[86]};
		border-bottom: 1px solid ${neutral[86]};
		& > * + * {
			border-top: 1px solid ${neutral[86]};
		}
	}

	${between.tablet.and.desktop} {
		& > * + * {
			margin-top: ${space[6]}px;
		}
	}

	${from.desktop} {
		flex-direction: row;

		& > * + * {
			margin-left: ${space[6]}px;
		}
	}
`;

const columnContainer = css`
	${until.tablet} {
		& > * + * {
			border-top: 1px solid ${neutral[86]};
		}
	}

	${from.tablet} {
		& > * + * {
			margin-top: ${space[6]}px;
		}
	}
	${from.desktop} {
		width: calc(50% - ${space[3]}px);
	}
`;

const buttonContainer = css`
	padding: ${space[12]}px 0;
`;

const isLargeDonation = (
	amount: number,
	contributionType: ContributionType,
	paymentMethod: PaymentMethod,
): boolean => {
	if (paymentMethod === PayPal && contributionType === 'ONE_OFF') {
		// We do not have the amount after the redirect
		return false;
	}

	const largeDonations = {
		MONTHLY: 20,
		ANNUAL: 100,
		ONE_OFF: 100,
	};
	return amount >= largeDonations[contributionType];
};

type ContributionThankYouProps = {
	csrf: CsrfState;
	email: string;
	contributionType: ContributionType;
	amount: number;
	currency: IsoCurrency;
	name: string;
	user: User;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	paymentMethod: PaymentMethod;
	countryId: IsoCountry;
	campaignCode?: string;
	isInNewProductTest: boolean;
};

const mapStateToProps = (state: State) => {
	const contributionType = getContributionType(state);
	return {
		email: state.page.checkoutForm.personalDetails.email,
		name: state.page.checkoutForm.personalDetails.firstName,
		contributionType,
		amount: getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			contributionType,
		),
		currency: state.common.internationalisation.currencyId,
		csrf: state.page.checkoutForm.csrf,
		user: state.page.user,
		userTypeFromIdentityResponse: state.page.form.userTypeFromIdentityResponse,
		paymentMethod: state.page.checkoutForm.payment.paymentMethod,
		countryId: state.common.internationalisation.countryId,
		campaignCode: state.common.referrerAcquisitionData.campaignCode,
		isInNewProductTest: state.common.abParticipations.newProduct === 'variant',
	};
};

function ContributionThankYou({
	csrf,
	email,
	name,
	contributionType,
	amount,
	currency,
	user,
	userTypeFromIdentityResponse,
	paymentMethod,
	countryId,
	campaignCode,
	isInNewProductTest,
}: ContributionThankYouProps) {
	const isNewAccount = userTypeFromIdentityResponse === 'new';

	const campaignSettings = useMemo<CampaignSettings | null>(
		() => getCampaignSettings(campaignCode),
		[],
	);

	useEffect(() => {
		trackUserData(
			paymentMethod,
			contributionType,
			user.isSignedIn,
			!isNewAccount,
			isLargeDonation(amount, contributionType, paymentMethod),
		);
	}, []);

	const signUpAction = {
		component: <ContributionThankYouSignUp />,
		shouldShow: isNewAccount,
	};

	const signInAction = {
		component: <ContributionThankYouSignIn email={email} csrf={csrf} />,
		// Show this to existing guest accounts as well - it will take them through the password flow
		shouldShow: !isNewAccount && !user.isSignedIn && email.length > 0,
	};

	const marketingConsentAction = {
		component: (
			<ContributionThankYouMarketingConsent email={email} csrf={csrf} />
		),
		shouldShow: contributionType === 'ONE_OFF' && email.length > 0,
	};

	const supportReminderAction = {
		component: <ContributionThankYouSupportReminder email={email} />,
		shouldShow: contributionType === 'ONE_OFF' && email.length > 0,
	};

	const surveyAction = {
		component: <ContributionThankYouSurvey countryId={countryId} />,
		shouldShow: true,
	};

	const socialShareAction = {
		component: (
			<ContributionThankYouSocialShare
				email={email}
				createReferralCodes={campaignSettings?.createReferralCodes ?? false}
				campaignCode={campaignSettings?.campaignCode}
				countryId={countryId}
			/>
		),
		shouldShow: true,
	};

	const ausMapAction = {
		component: <ContributionThankYouAusMap />,
		shouldShow: countryId === 'AU',
	};

	const defaultActions = [
		signUpAction,
		signInAction,
		marketingConsentAction,
		supportReminderAction,
		surveyAction,
		socialShareAction,
	];

	const ausActions = [
		signUpAction,
		signInAction,
		marketingConsentAction,
		supportReminderAction,
		surveyAction,
		ausMapAction,
		socialShareAction,
	];

	const actions = countryId === 'AU' ? ausActions : defaultActions;
	const shownComponents = actions
		.filter((action) => action.shouldShow)
		.map((action) => action.component);

	const numberOfComponentsInFirstColumn = shownComponents.length >= 6 ? 3 : 2;
	const firstColumn = shownComponents.slice(0, numberOfComponentsInFirstColumn);
	const secondColumn = shownComponents.slice(numberOfComponentsInFirstColumn);

	const showNewProductThankYouText =
		isInNewProductTest &&
		shouldShowBenefitsThankYouText(countryId, amount, contributionType);

	return (
		<div css={container}>
			<div css={headerContainer}>
				<ContributionThankYouHeader
					name={name}
					showDirectDebitMessage={paymentMethod === DirectDebit}
					paymentMethod={paymentMethod}
					contributionType={contributionType}
					amount={amount}
					currency={currency}
					shouldShowLargeDonationMessage={isLargeDonation(
						amount,
						contributionType,
						paymentMethod,
					)}
					showNewProductThankYouText={showNewProductThankYouText}
				/>
			</div>

			<div css={columnsContainer}>
				<div css={columnContainer}>{firstColumn}</div>
				<div css={columnContainer}>{secondColumn}</div>
			</div>

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
		</div>
	);
}

export default connect(mapStateToProps)(ContributionThankYou);
