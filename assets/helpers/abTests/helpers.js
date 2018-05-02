// @flow

import type { Participations } from './abtest';

function getVariantForTest(participations: Participations, test: string) {
  return participations ? participations[test] : null;
}

function inRepositionPaymentLogosTest(participations: Participations) {
  return getVariantForTest(participations, 'repositionPaymentLogosTest') === 'variant';
}

export {
  getVariantForTest,
  inRepositionPaymentLogosTest,
};

