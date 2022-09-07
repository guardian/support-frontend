import { personalDetailsSlice } from './reducer';

export const {
	setTitle,
	setFirstName,
	setLastName,
	setEmail,
	setConfirmEmail,
	setIsSignedIn,
	setUserTypeFromIdentityResponse,
	setTelephone,
} = personalDetailsSlice.actions;
