export type Phase = 'entry' | 'confirmation';
export type SortCodeIndex = 0 | 1 | 2;

export type DirectDebitState = {
	isPopUpOpen: boolean;
	isDDGuaranteeOpen: boolean;
	sortCodeArray: string[];
	sortCodeString: string;
	accountNumber: string;
	accountHolderName: string;
	accountHolderConfirmation: boolean;
	formError: string;
	phase: Phase;
};

export type SortCodeUpdate = {
	index: SortCodeIndex;
	partialSortCode: string;
};

export const initialDirectDebitState: DirectDebitState = {
	isPopUpOpen: false,
	isDDGuaranteeOpen: false,
	sortCodeArray: Array<string>(3).fill(''),
	sortCodeString: '',
	accountNumber: '',
	accountHolderName: '',
	accountHolderConfirmation: false,
	formError: '',
	phase: 'entry',
};
