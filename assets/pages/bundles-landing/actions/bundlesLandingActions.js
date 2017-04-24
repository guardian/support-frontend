// ----- Actions ----- //

export function changePaperBundle(bundle) {
  return { type: 'CHANGE_PAPER_BUNDLE', payload: bundle };
}

export function changeContribType(contribType) {
  return { type: 'CHANGE_CONTRIB_TYPE', payload: contribType };
}

export function changeContribAmount(amount) {
  return { type: 'CHANGE_CONTRIB_AMOUNT', payload: amount };
}

export function changeContribAmountRecurring(amount) {
  return { type: 'CHANGE_CONTRIB_AMOUNT_RECURRING', payload: amount };
}

export function changeContribAmountOneOff(amount) {
  return { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', payload: amount };
}

