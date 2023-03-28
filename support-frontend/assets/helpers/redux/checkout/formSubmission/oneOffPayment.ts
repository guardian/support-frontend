import { getAmount } from 'helpers/contributions';
import type {
	AmazonPayData,
	StripeChargeData,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type {
	AmazonPayAuthorisation,
	StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	getStripeKey,
	stripeAccountForContributionType,
} from 'helpers/forms/stripe';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { derivePaymentApiAcquisitionData } from 'helpers/tracking/acquisitions';
import { getContributionType } from '../product/selectors/productType';

export function buildStripeChargeDataFromAuthorisation(
	stripePaymentMethod: StripePaymentMethod,
	state: ContributionsState,
): StripeChargeData {
	return {
		paymentData: {
			currency: state.common.internationalisation.currencyId,
			amount: getAmount(
				state.page.checkoutForm.product.selectedAmounts,
				state.page.checkoutForm.product.otherAmounts,
				getContributionType(state),
			),
			email: state.page.checkoutForm.personalDetails.email,
			stripePaymentMethod,
		},
		acquisitionData: derivePaymentApiAcquisitionData(
			state.common.referrerAcquisitionData,
			state.common.abParticipations,
		),
		publicKey: getStripeKey(
			stripeAccountForContributionType[getContributionType(state)],
			state.common.internationalisation.countryId,
			state.page.user.isTestUser,
		),
		recaptchaToken: state.page.checkoutForm.recaptcha.token,
	};
}

export function amazonPayDataFromAuthorisation(
	authorisation: AmazonPayAuthorisation,
	state: ContributionsState,
): AmazonPayData {
	return {
		paymentData: {
			currency: state.common.internationalisation.currencyId,
			amount: getAmount(
				state.page.checkoutForm.product.selectedAmounts,
				state.page.checkoutForm.product.otherAmounts,
				getContributionType(state),
			),
			orderReferenceId: authorisation.orderReferenceId ?? '',
			email: state.page.checkoutForm.personalDetails.email,
		},
		acquisitionData: derivePaymentApiAcquisitionData(
			state.common.referrerAcquisitionData,
			state.common.abParticipations,
		),
	};
}
