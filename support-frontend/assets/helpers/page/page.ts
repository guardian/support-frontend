// ----- Imports ----- //
import { configureStore } from '@reduxjs/toolkit';
import type { Action, Reducer, Store } from 'redux';
import { combineReducers } from 'redux';
import type { Participations } from 'helpers/abTests/abtest';
import * as abTest from 'helpers/abTests/abtest';
import { getAmounts } from 'helpers/abTests/helpers';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import {
	analyticsInitialisation,
	consentInitialisation,
} from 'helpers/page/analyticsAndConsent';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type {
	CommonState,
	Internationalisation,
} from 'helpers/redux/commonState/state';
import { renderError } from 'helpers/rendering/render';
import {
	getCampaign,
	getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import {
	getAllQueryParamsWithExclusions,
	getQueryParameter,
} from 'helpers/urls/url';
import { localCurrencyCountries } from '../internationalisation/localCurrencyCountry';
import type { LocalCurrencyCountry } from '../internationalisation/localCurrencyCountry';

// ----- Types ----- //
export type ReduxState<PageState> = {
	common: CommonState;
	page: PageState;
};

// ----- Functions ----- //
function getLocalCurrencyCountry(
	countryId: IsoCountry,
	abParticipations: Participations,
): LocalCurrencyCountry | null | undefined {
	const queryParam = getQueryParameter('local-currency-country');

	if (queryParam) {
		return localCurrencyCountries[queryParam.toUpperCase()];
	}

	if (abParticipations.localCurrencyTestV2 === 'variant') {
		return localCurrencyCountries[countryId];
	}

	return null;
}

// Creates the initial state for the common reducer.
function buildInitialState(
	abParticipations: Participations,
	countryGroupId: CountryGroupId,
	countryId: IsoCountry,
	currencyId: IsoCurrency,
	settings: Settings,
	acquisitionData: ReferrerAcquisitionData,
): CommonState {
	const excludedParameters = ['REFPVID', 'INTCMP', 'acquisitionData'];
	const otherQueryParams = getAllQueryParamsWithExclusions(excludedParameters);
	const localCurrencyCountry = getLocalCurrencyCountry(
		countryId,
		abParticipations,
	);
	const internationalisation: Internationalisation = {
		countryGroupId,
		countryId,
		currencyId,
		useLocalCurrency: false,
		defaultCurrency: currencyId,
	};

	if (localCurrencyCountry) {
		internationalisation.localCurrencyCountry = localCurrencyCountry;
	}

	const amounts = getAmounts(settings, abParticipations, countryGroupId);
	return {
		campaign: getCampaign(acquisitionData),
		referrerAcquisitionData: acquisitionData,
		otherQueryParams,
		internationalisation,
		abParticipations,
		settings,
		amounts,
		defaultAmounts: amounts,
	};
}

// Initialises the page.
/*
  A note on the generics here. PageState is an abstract type representing anything we might assign
  to the `page` key in Redux state (see ReduxState type above), and PageAction is its corresponding
  abstract type representing any Redux action associated with whatever we pass as PageState.
  This allows us to construct a Redux store with state and action types for `common` determined by this function,
  but state and action types for `page` determined when this function is called
*/
function initRedux<PageState, PageAction extends Action>(
	pageReducer?: (commonState: CommonState) => Reducer<PageState, PageAction>,
): Store<ReduxState<PageState>> {
	try {
		const countryId: IsoCountry = detectCountry();
		const countryGroupId: CountryGroupId = detectCountryGroup();
		const currencyId: IsoCurrency = detectCurrency(countryGroupId);
		const settings = getSettings();
		const participations: Participations = abTest.init(
			countryId,
			countryGroupId,
			settings,
		);
		const acquisitionData: ReferrerAcquisitionData =
			getReferrerAcquisitionData();
		const initialState: CommonState = buildInitialState(
			participations,
			countryGroupId,
			countryId,
			currencyId,
			settings,
			acquisitionData,
		);

		const store = configureStore({
			reducer: combineReducers<ReduxState<PageState>>({
				common: commonReducer,
				page:
					pageReducer?.(initialState) ?? ({} as Reducer<PageState, PageAction>),
			}),
		});

		store.dispatch(setInitialCommonState(initialState));

		return store;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

function setUpTrackingAndConsents(): void {
	const countryId: IsoCountry = detectCountry();
	const countryGroupId: CountryGroupId = detectCountryGroup();
	const settings = getSettings();
	const participations: Participations = abTest.init(
		countryId,
		countryGroupId,
		settings,
	);
	const acquisitionData = getReferrerAcquisitionData();
	void consentInitialisation(countryId);
	analyticsInitialisation(participations, acquisitionData);
}

// ----- Exports ----- //
export { initRedux, setUpTrackingAndConsents };
