import type { Participations } from 'helpers/abTests/abtest';
import { fetchJson } from 'helpers/async/fetch';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import { postRegularPaymentRequest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type {
	PaymentResult,
	RegularPaymentRequest,
	SubscriptionProductFields,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import type { ReaderType } from 'helpers/productPrice/readerType';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { applyRedemptionRules } from 'helpers/subscriptionsForms/rules';
import {
	getOphanIds,
	getReferrerAcquisitionData,
	getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import type { Option } from 'helpers/types/option';
import { routes } from 'helpers/urls/routes';
import { getOrigin } from 'helpers/urls/url';
import type {
	RedemptionDispatch,
	RedemptionPageState,
	Stage,
} from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

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

function dispatchError(dispatch: RedemptionDispatch, error: Option<string>) {
	dispatch({
		type: 'SET_ERROR',
		error,
	});
}

function dispatchReaderType(
	dispatch: RedemptionDispatch,
	readerType: Option<ReaderType>,
) {
	dispatch({
		type: 'SET_READER_TYPE',
		readerType,
	});
}

function dispatchStage(dispatch: RedemptionDispatch, stage: Stage) {
	dispatch({
		type: 'SET_STAGE',
		stage,
	});
}

function validateWithServer(userCode: string, dispatch: RedemptionDispatch) {
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

function validateUserCode(
	userCode: string,
	dispatch: RedemptionDispatch,
): void {
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

function validateFormFields(
	dispatch: RedemptionDispatch,
	state: RedemptionPageState,
) {
	const formFieldErrors = applyRedemptionRules(state.page.checkout);

	if (formFieldErrors.length) {
		dispatch({
			type: 'SET_FORM_ERRORS',
			errors: formFieldErrors,
		});
	}

	return formFieldErrors.length === 0;
}

function handleCodeValidationResult(
	dispatch: RedemptionDispatch,
	state: RedemptionPageState,
) {
	return function handleResult(result: ValidationResult) {
		if (result.valid) {
			createSubscription(dispatch, state);
		} else {
			dispatchError(dispatch, result.errorMessage);
			dispatchStage(dispatch, 'form');
		}
	};
}

function handleCodeValidationError(dispatch: RedemptionDispatch) {
	return function handleError(error: Error) {
		dispatchError(
			dispatch,
			`An error occurred while validating this code: ${error.message}`,
		);
		dispatchStage(dispatch, 'form');
	};
}

function submitCode(
	dispatch: RedemptionDispatch,
	state: RedemptionPageState,
): void {
	const userCode = state.page.userCode ?? '';
	if (validateFormFields(dispatch, state)) {
		dispatchStage(dispatch, 'processing');
		validate(userCode)
			.then(handleCodeValidationResult(dispatch, state))
			.catch(handleCodeValidationError(dispatch));
	}
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
	const product: SubscriptionProductFields = {
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
	dispatch: RedemptionDispatch,
	state: RedemptionPageState,
): void {
	if (state.page.readerType == null) {
		dispatchError(
			dispatch,
			'An error occurred while redeeming this code, please try again later',
		);

		return;
	}

	const data = buildRegularPaymentRequest(
		state.page.userCode ?? '',
		state.page.readerType,
		state.page.checkout.firstName,
		state.page.checkout.lastName,
		state.page.checkout.email,
		state.page.checkout.telephone,
		state.common.internationalisation.currencyId,
		state.common.internationalisation.countryId,
		state.common.abParticipations,
	);

	const handleSubscribeResult = (result: PaymentResult) => {
		if (result.paymentStatus === 'success') {
			if (result.subscriptionCreationPending) {
				dispatchStage(dispatch, 'thankyou-pending');
			} else {
				dispatchStage(dispatch, 'thankyou');
			}
		} else {
			dispatchError(dispatch, appropriateErrorMessage(result.error ?? ''));
			dispatchStage(dispatch, 'form');
		}
	};

	postRegularPaymentRequest(
		routes.subscriptionCreate,
		data,
		state.common.abParticipations,
		state.page.csrf,
	)
		.then(handleSubscribeResult)
		.catch(() => null);
}

export { validateUserCode, submitCode, createSubscription };
