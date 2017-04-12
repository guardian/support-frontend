// ----- Actions ----- //

export function changePaperBundle(bundle) {
  return { type: 'CHANGE_PAPER_BUNDLE', payload: bundle };
}

export function changeContribPeriod(period) {
  return { type: 'CHANGE_CONTRIB_PERIOD', payload: period };
}
