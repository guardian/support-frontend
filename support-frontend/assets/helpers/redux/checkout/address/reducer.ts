import type { PayloadAction } from '@reduxjs/toolkit';
import {
	combineReducers,
	createAsyncThunk,
	createSlice,
} from '@reduxjs/toolkit';
import { findAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { fromString } from 'helpers/internationalisation/country';
import { getSliceErrorsFromZodResult } from 'helpers/redux/utils/validation/errors';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import { removeError } from 'helpers/subscriptionsForms/validation';
import { validateForm } from '../checkoutActions';
import type { AddressFormFieldError } from './state';
import {
	addressFieldsSchema,
	getInitialAddressFieldsState,
	initialPostcodeFinderState,
} from './state';

// ---- Reducers ---- //

export const {
	reducer: deliveryAddressReducer,
	fieldsSlice: deliveryAddressFieldsSlice,
	postcodeFinderSlice: deliveryAddressPostcodeFinderSlice,
	findAddresses: deliveryAddressFindAddresses,
} = getAddressReducer('delivery');

export const {
	reducer: billingAddressReducer,
	fieldsSlice: billingAddressFieldsSlice,
	postcodeFinderSlice: billingAddressPostcodeFinderSlice,
	findAddresses: billingAddressFindAddresses,
} = getAddressReducer('billing');

// ---- Helpers ---- //

function getAddressReducer(type: AddressType) {
	const fieldsSlice = getAddressFieldsSlice(type);
	const { slice: postcodeFinderSlice, findAddresses } =
		getPostcodeFinderSlice(type);

	const reducer = combineReducers({
		fields: fieldsSlice.reducer,
		postcode: postcodeFinderSlice.reducer,
	});

	return { reducer, fieldsSlice, postcodeFinderSlice, findAddresses };
}

function getAddressFieldsSlice(type: AddressType) {
	return createSlice({
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
		extraReducers: (builder) => {
			builder.addCase(validateForm, (state) => {
				const validationResult = addressFieldsSchema.safeParse(state);
				if (!validationResult.success) {
					state.errorObject = getSliceErrorsFromZodResult(
						validationResult.error.format(),
					);
				}
			});
		},
	});
}

function getPostcodeFinderSlice(type: AddressType) {
	const findAddresses = createAsyncThunk(
		`${type}PostcodeFinder/findAddresses`,
		findAddressesForPostcode,
	);

	const slice = createSlice({
		name: `${type}PostcodeFinder`,
		initialState: initialPostcodeFinderState,
		reducers: {
			setPostcode(state, action: PayloadAction<string>) {
				state.postcode = action.payload;
			},
			setError(state, action: PayloadAction<string>) {
				state.error = action.payload;
			},
		},
		extraReducers: (builder) => {
			builder.addCase(findAddresses.pending, (state) => {
				state.isLoading = true;
				state.error = undefined;
			});
			builder.addCase(findAddresses.fulfilled, (state, action) => {
				state.isLoading = false;
				state.results = action.payload;
			});
			builder.addCase(findAddresses.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
			});
		},
	});

	return { slice, findAddresses };
}
