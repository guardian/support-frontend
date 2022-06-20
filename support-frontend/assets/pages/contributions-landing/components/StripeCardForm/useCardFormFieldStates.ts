import type { StripeElementChangeEvent } from '@stripe/stripe-js';
import { useState } from 'react';
import type { CardFieldName } from './fields';

// ---- Types ---- //

type CardFieldState =
	| {
			name: 'Error';
			errorMessage: string;
	  }
	| {
			name: 'Incomplete';
	  }
	| {
			name: 'Complete';
	  };

type FieldStates = Record<CardFieldName, CardFieldState>;

interface CardFormFieldStates {
	fieldStates: FieldStates;
	onFieldChange: (
		fieldName: CardFieldName,
	) => (update: StripeElementChangeEvent) => void;
	errorMessage?: string;
}

// ---- Hook ---- //

export function useCardFormFieldStates(): CardFormFieldStates {
	const [fieldStates, setFieldStates] =
		useState<FieldStates>(INITAL_FIELD_STATES);

	const onFieldChange =
		(fieldName: CardFieldName) => (update: StripeElementChangeEvent) => {
			setFieldStates((prevData) => ({
				...prevData,
				[fieldName]: updatedFieldState(update),
			}));
		};

	return {
		fieldStates,
		onFieldChange,
		errorMessage: errorMessage(fieldStates),
	};
}

// ---- Helpers ---- //

const INITAL_FIELD_STATES: FieldStates = {
	CardNumber: {
		name: 'Incomplete',
	},
	Expiry: {
		name: 'Incomplete',
	},
	CVC: {
		name: 'Incomplete',
	},
};

// --- Field state update helper --- //

function updatedFieldState(update: StripeElementChangeEvent): CardFieldState {
	if (update.error) {
		return fieldStateError(update.error.message);
	}
	if (update.complete) {
		return FIELD_STATE_COMPLETE;
	}

	return FIELD_STATE_INCOMPLETE;
}

// --- Field state constructors --- //

function fieldStateError(errorMessage: string): CardFieldState {
	return { name: 'Error', errorMessage };
}
const FIELD_STATE_COMPLETE: CardFieldState = { name: 'Complete' };

const FIELD_STATE_INCOMPLETE: CardFieldState = { name: 'Incomplete' };

// --- Field error helpers --- //

function errorMessage(fieldStates: FieldStates): string | undefined {
	return (
		errorMessageFromState(fieldStates.CardNumber) ??
		errorMessageFromState(fieldStates.Expiry) ??
		errorMessageFromState(fieldStates.CVC) ??
		incompleteErrorFromState(fieldStates.CardNumber) ??
		incompleteErrorFromState(fieldStates.Expiry) ??
		incompleteErrorFromState(fieldStates.CVC)
	);
}

function errorMessageFromState(state: CardFieldState): string | undefined {
	return state.name === 'Error' ? state.errorMessage : undefined;
}

function incompleteErrorFromState(state: CardFieldState): string | undefined {
	return state.name === 'Incomplete'
		? 'Please complete your card details'
		: undefined;
}
