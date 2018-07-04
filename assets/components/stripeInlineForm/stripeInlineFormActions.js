// @flow

// ----- Types ----- //

export type Action =
  | { type: 'STRIPE_IS_LOADED', scope: string }
  | { type: 'SET_ERROR', scope: string, message: string }
  | { type: 'RESET_ERROR', scope: string };


// ----- Action Creators ----- //

function stripeInlineFormActionsFor(scope: string): Object {

  return {
    stripeIsLoaded(): Action {
      return { type: 'STRIPE_IS_LOADED', scope };
    },
    setError(message: string): Action {
      return { type: 'SET_ERROR', scope, message };
    },
    resetError(): Action {
      return { type: 'RESET_ERROR', scope };
    },
  };
}


// ----- Exports ----- //

export { stripeInlineFormActionsFor };
