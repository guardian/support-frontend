// ----- Types ----- //
export type MarketingConsentState = {
	error: boolean;
	confirmOptIn: boolean | null | undefined;
	requestPending: boolean;
};
// ----- Setup ----- //
export const initialMarketingConsentState: MarketingConsentState = {
	error: false,
	confirmOptIn: null,
	requestPending: false,
};
