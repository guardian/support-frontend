import type { Dispatch } from 'redux';
import type { $Call } from 'utility-types';
import 'redux';
import 'helpers/types/option';
import type { Scoped } from 'helpers/subscriptionsForms/scoped';
import 'helpers/subscriptionsForms/scoped';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import 'helpers/subscriptionsForms/addressType';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { getAddressesForPostcode } from 'components/subscriptionCheckouts/address/postcodeLookup';
import type { ErrorMessage } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';

export type PostcodeFinderState = {
	results: PostcodeFinderResult[];
	isLoading: boolean;
	postcode: Option<string>;
	error: Option<ErrorMessage>;
};
export type PostcodeFinderActions =
	| (Scoped<AddressType> & {
			type: 'FILL_POSTCODE_FINDER_RESULTS';
			results: PostcodeFinderResult[];
	  })
	| (Scoped<AddressType> & {
			type: 'SET_POSTCODE_FINDER_ERROR';
			error: Option<string>;
	  })
	| (Scoped<AddressType> & {
			type: 'START_POSTCODE_FINDER_FETCH_RESULTS';
	  })
	| (Scoped<AddressType> & {
			type: 'SET_POSTCODE_FINDER_POSTCODE';
			postcode: Option<string>;
	  });

const postcodeFinderActionCreatorsFor = (scope: AddressType) => ({
	setPostcode: (postcode: string) => ({
		type: 'SET_POSTCODE_FINDER_POSTCODE',
		postcode,
		scope,
	}),
	fetchResults:
		(postcode: Option<string>) =>
		(dispatch: Dispatch<PostcodeFinderActions>) => {
			if (!postcode) {
				dispatch({
					type: 'SET_POSTCODE_FINDER_ERROR',
					error: 'Please enter a postcode',
					scope,
				});
			} else {
				dispatch({
					type: 'START_POSTCODE_FINDER_FETCH_RESULTS',
					scope,
				});
				getAddressesForPostcode(postcode)
					.then((results) => {
						dispatch({
							type: 'FILL_POSTCODE_FINDER_RESULTS',
							results,
							scope,
						});
					})
					.catch((reason) => {
						dispatch({
							type: 'SET_POSTCODE_FINDER_ERROR',
							error: reason.message,
							scope,
						});
					});
			}
		},
});

export type PostcodeFinderActionCreators = $Call<
	typeof postcodeFinderActionCreatorsFor,
	AddressType
>;
const initialState = {
	results: [],
	isLoading: false,
	postcode: null,
	error: null,
};

const postcodeFinderReducerFor =
	(scope: AddressType) =>
	(
		state: PostcodeFinderState = initialState,
		action: PostcodeFinderActions,
	): PostcodeFinderState => {
		if (action.scope !== scope) {
			return state;
		}

		switch (action.type) {
			case 'FILL_POSTCODE_FINDER_RESULTS':
				return { ...state, isLoading: false, results: action.results };

			case 'SET_POSTCODE_FINDER_POSTCODE':
				return { ...state, results: [], postcode: action.postcode };

			case 'SET_POSTCODE_FINDER_ERROR':
				return { ...state, isLoading: false, error: action.error };

			case 'START_POSTCODE_FINDER_FETCH_RESULTS':
				return {
					...initialState,
					error: null,
					isLoading: true,
					postcode: state.postcode,
				};

			default:
				return state;
		}
	};

export { postcodeFinderReducerFor, postcodeFinderActionCreatorsFor };
