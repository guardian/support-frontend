import { sepaSlice } from './reducer';

export const {
	setSepaIban,
	setSepaAccountHolderName,
	setSepaAddressStreetName,
	setSepaAddressCountry,
} = sepaSlice.actions;
