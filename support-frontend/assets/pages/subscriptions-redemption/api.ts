import type { Dispatch } from 'redux';
import 'redux';
import type { Participations } from 'helpers/abTests/abtest';
import { fetchJson } from 'helpers/async/fetch';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import { postRegularPaymentRequest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type {
	PaymentResult,
	RegularPaymentRequest,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import type { ReaderType } from 'helpers/productPrice/readerType';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import {
	getOphanIds,
	getReferrerAcquisitionData,
	getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import type { Option } from 'helpers/types/option';
import { routes } from 'helpers/urls/routes';
import { getOrigin } from 'helpers/urls/url';
import type { Action } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

type ValidationResult = {
	valid: boolean;
	readerType: Option<ReaderType>;
	errorMessage: Option<string>;
};

function validate(userCode: string): Promise<ValidationResult> {
	if (userCode === '') {
		return Promise.resolve({
			valid: false,
			readerType: null,
			errorMessage: 'Please enter your code',
		});
	}

	const isTestUser = !!getGlobal<string>('isTestUser');
	const validationUrl = `${getOrigin()}/subscribe/redeem/validate/${userCode}${
		isTestUser ? '?isTestUser=true' : ''
	}`;
	return fetchJson(validationUrl, {}) as Promise<ValidationResult>;
}

function dispatchError(dispatch: Dispatch<Action>, error: Option<string>) {
	dispatch({
		type: 'SET_ERROR',
		error,
	});
}

function dispatchReaderType(
	dispatch: Dispatch<Action>,
	readerType: Option<ReaderType>,
) {
	dispatch({
		type: 'SET_READER_TYPE',
		readerType,
	});
}

function validateWithServer(userCode: string, dispatch: Dispatch<Action>) {
	validate(userCode)
		.then((result: ValidationResult) => {
			dispatchError(dispatch, result.errorMessage);
			dispatchReaderType(dispatch, result.readerType);
		})
		.catch((error: Error) => {
			dispatchError(
				dispatch,
				`An error occurred while validating this code: ${error.message}`,
			);
		});
}

function validateUserCode(userCode: string, dispatch: Dispatch<Action>): void {
	dispatch({
		type: 'SET_USER_CODE',
		userCode,
	});
	const codeLength = getGlobal('codeLength') || 13;

	if (userCode.length === codeLength) {
		validateWithServer(userCode, dispatch);
	} else {
		dispatchError(dispatch, 'Please check the code and try again');
	}
}

function submitCode(
	userCode: string,
	readerType: Option<ReaderType>,
	firstName: string,
	lastName: string,
	email: string,
	telephone: string,
	currencyId: IsoCurrency,
	countryId: IsoCountry,
	participations: Participations,
	csrf: Csrf,
	dispatch: Dispatch<Action>,
): void {
	validate(userCode)
		.then((result: ValidationResult) => {
			if (result.valid) {
				createSubscription(
					userCode,
					readerType,
					firstName,
					lastName,
					email,
					telephone,
					currencyId,
					countryId,
					participations,
					csrf,
					dispatch,
				);
			} else {
				dispatchError(dispatch, result.errorMessage);
			}
		})
		.catch((error: Error) => {
			dispatchError(
				dispatch,
				`An error occurred while validating this code: ${error.message}`,
			);
		});
}

function buildRegularPaymentRequest(
	userCode: string,
	readerType: ReaderType,
	firstName: string,
	lastName: string,
	email: string,
	telephone: string,
	currencyId: IsoCurrency,
	countryId: IsoCountry,
	participations: Participations,
): RegularPaymentRequest {
	const product = {
		productType: DigitalPack,
		currency: currencyId,
		billingPeriod: Monthly,
		readerType,
	};
	return {
		title: null,
		firstName,
		lastName,
		billingAddress: {
			country: countryId,
			state: null,
			lineOne: null,
			lineTwo: null,
			postCode: null,
			city: null,
		},
		deliveryAddress: null,
		email: email,
		telephoneNumber: telephone,
		product,
		firstDeliveryDate: null,
		paymentFields: {
			redemptionCode: userCode,
		},
		ophanIds: getOphanIds(),
		referrerAcquisitionData: getReferrerAcquisitionData(),
		supportAbTests: getSupportAbTests(participations),
		debugInfo: 'no form/redux for redemption page',
	};
}

function createSubscription(
	userCode: string,
	readerType: Option<ReaderType>,
	firstName: string,
	lastName: string,
	email: string,
	telephone: string,
	currencyId: IsoCurrency,
	countryId: IsoCountry,
	participations: Participations,
	csrf: Csrf,
	dispatch: Dispatch<Action>,
): void {
	if (readerType == null) {
		dispatchError(
			dispatch,
			'An error occurred while redeeming this code, please try again later',
		);
		return;
	}

	const data = buildRegularPaymentRequest(
		userCode,
		readerType,
		firstName,
		lastName,
		email,
		telephone,
		currencyId,
		countryId,
		participations,
	);

	console.log(data);

	const handleSubscribeResult = (result: PaymentResult) => {
		if (result.paymentStatus === 'success') {
			if (result.subscriptionCreationPending) {
				const thankyouUrl = `${getOrigin()}/subscribe/redeem/thankyou-pending`;
				window.location.replace(thankyouUrl);
			} else {
				const thankyouUrl = `${getOrigin()}/subscribe/redeem/thankyou`;
				window.location.replace(thankyouUrl);
			}
		} else {
			dispatchError(dispatch, appropriateErrorMessage(result.error ?? ''));
			dispatch({
				type: 'SET_STAGE',
				stage: 'form',
			});
		}
	};

	postRegularPaymentRequest(
		routes.subscriptionCreate,
		data,
		participations,
		csrf,
	)
		.then(handleSubscribeResult)
		.catch(() => null);
}

export { validateUserCode, submitCode, createSubscription };
