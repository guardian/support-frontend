import type { CsrCustomerData } from 'components/csr/csrMode';
import { csrUserName } from 'components/csr/csrMode';
import {
	M25_POSTCODE_PREFIXES,
	postcodeIsWithinDeliveryArea,
} from 'helpers/forms/deliveryCheck';
import { isValidPostcode } from 'helpers/forms/formValidation';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	setBillingAddressLineOne,
	setBillingCountry,
	setBillingPostcode,
	setBillingState,
	setBillingTownCity,
	setDeliveryAddressLineOne,
	setDeliveryCountry,
	setDeliveryPostcode,
	setDeliveryState,
	setDeliveryTownCity,
} from 'helpers/redux/checkout/address/actions';
import {
	clearDeliveryAgentResponse,
	setBillingAddressMatchesDelivery,
	setDeliveryAgent,
	setDeliveryInstructions,
} from 'helpers/redux/checkout/addressMeta/actions';
import { getDeliveryAgentsThunk } from 'helpers/redux/checkout/addressMeta/thunks';
import {
	setEmail as setEmailGift,
	setFirstName as setFirstNameGift,
	setGiftDeliveryDate,
	setGiftMessage,
	setLastName as setLastNameGift,
	setTitle as setTitleGift,
} from 'helpers/redux/checkout/giftingState/actions';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import {
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
	setTelephone,
	setTitle,
} from 'helpers/redux/checkout/personalDetails/actions';
import {
	setAddDigital,
	setBillingPeriod,
	setOrderIsAGift,
	setStartDate,
} from 'helpers/redux/checkout/product/actions';
import type {
	SubscriptionsDispatch,
	SubscriptionsState,
} from 'helpers/redux/subscriptionsStore';
import { onPaymentAuthorised } from 'helpers/subscriptionsForms/submit';
import type { AddressType } from './addressType';
import type { Action } from './formActions';

const formActionCreators = {
	setTitle,
	setFirstName,
	setLastName,
	setEmail,
	setConfirmEmail,
	setTelephone,
	setTitleGift,
	setFirstNameGift,
	setLastNameGift,
	setEmailGift,
	setStartDate,
	setBillingPeriod,
	setPaymentMethod,
	setBillingAddressMatchesDelivery,
	onPaymentAuthorised:
		(authorisation: PaymentAuthorisation) =>
		(
			dispatch: SubscriptionsDispatch,
			getState: () => SubscriptionsState,
		): void => {
			const state = getState();
			onPaymentAuthorised(authorisation, dispatch, state);
		},
	setGiftStatus: setOrderIsAGift,
	setDeliveryInstructions,
	setGiftMessage,
	setDigitalGiftDeliveryDate: setGiftDeliveryDate,
	setAddDigitalSubscription: setAddDigital,
	setCsrUsername: (username: string): Action => ({
		type: 'SET_CSR_USERNAME',
		username,
	}),
	setSalesforceCaseId: (caseId: string): Action => ({
		type: 'SET_SALESFORCE_CASE_ID',
		caseId,
	}),
};

function setCsrCustomerData(
	addressType: AddressType,
	csrCustomerData: CsrCustomerData,
) {
	return (dispatch: SubscriptionsDispatch): void => {
		const { email, firstName, country, street, city, postcode, state } =
			csrCustomerData.customer;

		email && dispatch(formActionCreators.setEmail(email));
		email && dispatch(formActionCreators.setConfirmEmail(email));
		firstName && dispatch(formActionCreators.setFirstName(firstName));
		dispatch(formActionCreators.setLastName(csrCustomerData.customer.lastName));

		dispatch(formActionCreators.setCsrUsername(csrUserName(csrCustomerData)));
		dispatch(formActionCreators.setSalesforceCaseId(csrCustomerData.caseId));

		const addressActions = addressActionCreatorsFor(addressType);
		country && dispatch(addressActions.setCountry(country));
		street && dispatch(addressActions.setAddressLineOne(street));
		city && dispatch(addressActions.setTownCity(city));
		postcode && dispatch(addressActions.setPostcode(postcode));
		state && dispatch(addressActions.setState(state));
	};
}

function addressActionCreatorsFor(addressType: AddressType) {
	return addressType === 'billing'
		? {
				setCountry: setBillingCountry,
				setAddressLineOne: setBillingAddressLineOne,
				setTownCity: setBillingTownCity,
				setPostcode: setBillingPostcode,
				setState: setBillingState,
		  }
		: {
				setCountry: setDeliveryCountry,
				setAddressLineOne: setDeliveryAddressLineOne,
				setTownCity: setDeliveryTownCity,
				setPostcode: setDeliveryPostcode,
				setState: setDeliveryState,
		  };
}

export function setPaperDeliveryPostcode(postcode: string) {
	return (dispatch: SubscriptionsDispatch): void => {
		if (
			isValidPostcode(postcode) &&
			!postcodeIsWithinDeliveryArea(postcode, M25_POSTCODE_PREFIXES)
		) {
			void dispatch(getDeliveryAgentsThunk(postcode));
		} else {
			dispatch(setDeliveryAgent());
			dispatch(clearDeliveryAgentResponse());
		}
		dispatch(setDeliveryPostcode(postcode));
	};
}

export type FormActionCreators = typeof formActionCreators;

export { setCsrCustomerData, formActionCreators };
