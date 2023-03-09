import { getAmount } from 'helpers/contributions';
import type {
	PaymentAuthorisation,
	RegularPaymentRequest,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { regularPaymentFieldsFromAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { DirectDebit, ExistingDirectDebit } from 'helpers/forms/paymentMethods';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';
import {
	findIsoCountry,
	stateProvinceFromString,
} from 'helpers/internationalisation/country';
import { Annual, Monthly } from 'helpers/productPrice/billingPeriods';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { isSupporterPlusPurchase } from '../product/selectors/isSupporterPlus';
import { getContributionType } from '../product/selectors/productType';
import { getSubscriptionPromotionForBillingPeriod } from '../product/selectors/subscriptionPrice';

function getBillingCountryAndState(
	authorisation: PaymentAuthorisation,
	state: ContributionsState,
): {
	billingCountry: IsoCountry;
	billingState?: StateProvince;
} {
	const pageBaseCountry = state.common.internationalisation.countryId; // Needed later
	const { country: billingCountry, state: billingState } =
		state.page.checkoutForm.billingAddress.fields;

	// If the user chose a Direct Debit payment method, then we must use the pageBaseCountry as the billingCountry.
	if (
		[DirectDebit, ExistingDirectDebit].includes(authorisation.paymentMethod)
	) {
		return {
			billingCountry: pageBaseCountry,
			billingState,
		};
	}

	// If the page form has a billingCountry, then it must have been provided by a wallet, ApplePay or
	// Payment Request Button, which will already have filtered the billingState by stateProvinceFromString,
	// so we can trust both values, verbatim.
	if (billingCountry) {
		return {
			billingCountry,
			billingState,
		};
	}

	// If we have a billingState but no billingCountry then the state must have come from the drop-down on the website,
	// wherupon it must match with the page's base country.
	if (billingState && !billingCountry) {
		return {
			billingCountry: pageBaseCountry,
			billingState:
				stateProvinceFromString(pageBaseCountry, billingState) ?? undefined,
		};
	}

	// Else, it's not a wallet transaction, and it's a no-state checkout page, so the only other option is to determine
	// the country and state from GEO-IP, and failing that, the page's base country, ultimately from the countryGroup
	// (e.g. DE for Europe, IN for International, GB for United Kingdom).
	const fallbackCountry =
		findIsoCountry(window.guardian.geoip?.countryCode) ?? pageBaseCountry;
	const fallbackState = stateProvinceFromString(
		billingCountry,
		window.guardian.geoip?.stateCode,
	);
	return {
		billingCountry: fallbackCountry,
		billingState: fallbackState ?? undefined,
	};
}

// This exists *only* to support the purchase of digi subs for migrating Kindle subscribers
function getPromoCode(state: ContributionsState) {
	const promotion = getSubscriptionPromotionForBillingPeriod(state);
	if (promotion) {
		return {
			promoCode: promotion.promoCode,
		};
	}
	return {};
}

function getProductFields(
	state: ContributionsState,
	amount: number,
): RegularPaymentRequest['product'] {
	// This exists *only* to support the purchase of digi subs for migrating Kindle subscribers
	if (state.page.checkoutForm.product.productType === 'DigitalPack') {
		return {
			productType: 'DigitalPack',
			readerType: 'Direct',
			currency: state.common.internationalisation.currencyId,
			billingPeriod: state.page.checkoutForm.product.billingPeriod,
		};
	}

	const contributionType = getContributionType(state);
	const productOptions = isSupporterPlusPurchase(state)
		? { productType: 'SupporterPlus' as const }
		: { productType: 'Contribution' as const };

	return {
		amount,
		currency: state.common.internationalisation.currencyId,
		billingPeriod: contributionType === 'MONTHLY' ? Monthly : Annual,
		...productOptions,
	};
}

export function regularPaymentRequestFromAuthorisation(
	authorisation: PaymentAuthorisation,
	state: ContributionsState,
): RegularPaymentRequest {
	const { actionHistory } = state.debug;
	const { billingCountry, billingState } = getBillingCountryAndState(
		authorisation,
		state,
	);
	const recaptchaToken = state.page.checkoutForm.recaptcha.token;
	const contributionType = getContributionType(state);

	const amount = getAmount(
		state.page.checkoutForm.product.selectedAmounts,
		state.page.checkoutForm.product.otherAmounts,
		contributionType,
	);

	return {
		firstName: state.page.checkoutForm.personalDetails.firstName.trim(),
		lastName: state.page.checkoutForm.personalDetails.lastName.trim(),
		email: state.page.checkoutForm.personalDetails.email.trim(),
		billingAddress: {
			lineOne: null,
			// required go cardless field
			lineTwo: null,
			// required go cardless field
			city: null,
			// required go cardless field
			state: billingState ?? null,
			// required Zuora field if country is US or CA
			postCode: null,
			// required go cardless field
			country: billingCountry, // required Zuora field
		},
		product: getProductFields(state, amount),
		firstDeliveryDate: null,
		paymentFields: {
			...regularPaymentFieldsFromAuthorisation(authorisation),
			recaptchaToken,
		},
		...getPromoCode(state),
		ophanIds: getOphanIds(),
		referrerAcquisitionData: state.common.referrerAcquisitionData,
		supportAbTests: getSupportAbTests(state.common.abParticipations),
		debugInfo: actionHistory,
	};
}
