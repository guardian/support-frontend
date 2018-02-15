// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_ERROR', scope: string, error: string }
  | { type: 'RESET_ERROR', scope: string };


// ----- Action Creators ----- //

function payPalContributionButtonActionsFor(scope: string): Object {

  return {
    setError(error: string): Action {
      return { type: 'SET_ERROR', scope, error };
    },
    resetError(): Action {
      return { type: 'RESET_ERROR', scope };
    },
  };

}


// ----- Exports ----- //

export {
  payPalContributionButtonActionsFor,
};
