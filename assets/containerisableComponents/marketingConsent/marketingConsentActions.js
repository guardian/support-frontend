// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_API_ERROR', scope: string, error: boolean }
  | { type: 'SET_CONFIRM_MARKETING_CONSENT', scope: string, confirmOptIn: boolean};

// ----- Action Creators ----- //

function marketingConsentActionsFor(scope: string): Object {

  return {
    setAPIError(error: boolean): Action {
      return { type: 'SET_API_ERROR', scope, error };
    },
    setConfirmMarketingConsent(confirmOptIn: boolean): Action {
      return { type: 'SET_CONFIRM_MARKETING_CONSENT', scope, confirmOptIn };
    },
  };
}


// ----- Exports ----- //

export { marketingConsentActionsFor };
