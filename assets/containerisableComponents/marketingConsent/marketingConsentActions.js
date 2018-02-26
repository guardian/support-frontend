// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_API_ERROR', scope: string, error: boolean };


// ----- Action Creators ----- //

function marketingConsentActionsFor(scope: string): Object {

  return {
    setAPIError(error: boolean): Action {
      return { type: 'SET_API_ERROR', scope, error };
    },
  };
}


// ----- Exports ----- //

export { marketingConsentActionsFor };
