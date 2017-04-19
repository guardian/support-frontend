// ----- Actions ----- //

export function changePaperBundle(bundle) {
  return { type: 'CHANGE_PAPER_BUNDLE', payload: bundle };
}

export function changeContribPeriod(period) {
  return { type: 'CHANGE_CONTRIB_PERIOD', payload: period };
}

export function changeContribAmountMonthly(amount) {
  return { type: 'CHANGE_CONTRIB_AMOUNT_MONTHLY', payload: amount };
}

export function changeContribAmountOneOff(amount) {
  return { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', payload: amount };
}
