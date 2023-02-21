import { personalDetailsSlice } from './reducer';

export const {
	setTitle,
	setFirstName,
	setLastName,
	setEmail,
	setConfirmEmail,
	setUserTypeFromIdentityResponse,
	setTelephone,
} = personalDetailsSlice.actions;
