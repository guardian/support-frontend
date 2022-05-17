// ----- Types ----- //
export type Action =
	| {
			type: 'SET_API_ERROR';
			scope: string;
			error: boolean;
	  }
	| {
			type: 'SET_CONFIRM_MARKETING_CONSENT';
			scope: string;
			confirmOptIn: boolean;
	  }
	| {
			type: 'SET_REQUEST_PENDING';
			scope: string;
			requestPending: boolean;
	  };

// ----- Action Creators ----- //
interface MarketingConsentActions {
	setAPIError: (error: boolean) => Action;
	setConfirmMarketingConsent: (confirmOptIn: boolean) => Action;
	setRequestPending: (requestPending: boolean) => Action;
}

function marketingConsentActionsFor(scope: string): MarketingConsentActions {
	return {
		setAPIError(error: boolean): Action {
			return {
				type: 'SET_API_ERROR',
				scope,
				error,
			};
		},

		setConfirmMarketingConsent(confirmOptIn: boolean): Action {
			return {
				type: 'SET_CONFIRM_MARKETING_CONSENT',
				scope,
				confirmOptIn,
			};
		},

		setRequestPending(requestPending: boolean): Action {
			return {
				type: 'SET_REQUEST_PENDING',
				scope,
				requestPending,
			};
		},
	};
}

// ----- Exports ----- //
export { marketingConsentActionsFor };
