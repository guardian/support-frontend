import { directDebitSlice } from './reducer';

export const {
	setAccountHolderConfirmation,
	setAccountHolderName,
	setAccountNumber,
	setDDGuaranteeClose,
	setDDGuaranteeOpen,
	setFormError,
	setPopupClose,
	setPopupOpen,
	setPhase,
	setSortCode,
	setSortCodeString,
	resetFormError,
} = directDebitSlice.actions;
