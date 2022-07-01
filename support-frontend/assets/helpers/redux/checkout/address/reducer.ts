import type { PayloadAction } from '@reduxjs/toolkit';
import { combineReducers, createSlice } from '@reduxjs/toolkit';
import { postcodeFinderReducerFor } from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import { fromString } from 'helpers/internationalisation/country';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import { removeError } from 'helpers/subscriptionsForms/validation';
import type { AddressFormFieldError } from './state';
import { getInitialAddressFieldsState } from './state';

function getAddressSlice(type: AddressType) {
	const fieldsSlice = createSlice({
		name: `${type}AddressFields`,
		initialState: getInitialAddressFieldsState,
		reducers: {
			setLineOne(state, action: PayloadAction<string>) {
				state.lineOne = action.payload;
				state.errors = removeError('lineOne', state.errors);
			},
			setLineTwo(state, action: PayloadAction<string>) {
				state.lineTwo = action.payload;
				state.errors = removeError('lineTwo', state.errors);
			},
			setTownCity(state, action: PayloadAction<string>) {
				state.city = action.payload;
				state.errors = removeError('city', state.errors);
			},
			setState(state, action: PayloadAction<string>) {
				state.state = action.payload;
				state.errors = removeError('state', state.errors);
			},
			setPostcode(state, action: PayloadAction<string>) {
				state.postCode = action.payload;
				state.errors = removeError('postCode', state.errors);
			},
			setCountry(state, action: PayloadAction<string>) {
				const country = fromString(action.payload);

				if (country) {
					state.country = country;
				}
			},
			setFormErrors(state, action: PayloadAction<AddressFormFieldError[]>) {
				state.errors = action.payload;
			},
		},
	});
	const fieldsReducer = fieldsSlice.reducer;

	const reducer = combineReducers({
		fields: fieldsReducer,
		postcode: postcodeFinderReducerFor(type),
	});

	return { fieldsSlice, reducer };
}

export const {
	fieldsSlice: deliveryAddressFieldsSlice,
	reducer: deliveryAddressReducer,
} = getAddressSlice('delivery');

export const {
	fieldsSlice: billingAddressFieldsSlice,
	reducer: billingAddressReducer,
} = getAddressSlice('billing');
