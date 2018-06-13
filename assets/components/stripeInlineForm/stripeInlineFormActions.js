// @flow

// ----- Types ----- //

export type Action =
  | { type: 'STRIPE_IS_LOADED', scope: string };


// ----- Action Creators ----- //

function stripeInlineFormActionsFor(scope: string): Object {

  return {
    stripeIsLoaded(): Action {
      return { type: 'STRIPE_IS_LOADED', scope };
    },
  };
}


// ----- Exports ----- //

export { stripeInlineFormActionsFor };
