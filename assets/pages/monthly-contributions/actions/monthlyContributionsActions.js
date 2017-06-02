// @flow

// ----- Types ----- //

export type Action = { type: 'SET_CONTRIB_AMOUNT', amount: string };


// ----- Actions ----- //

export default function setContribAmount(amount: string): Action {
  return { type: 'SET_CONTRIB_AMOUNT', amount };
}
