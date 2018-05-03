// @flow

import type { Participations } from './abtest';

function getVariantForTest(participations: Participations, test: string) {
  return participations ? participations[test] : null;
}

function getPaymentLogosTestVariant(participations: Participations) {
  return getVariantForTest(participations, 'paymentLogosTest');
}

function inPaymentLogosTest(participations: Participations) {
  return getPaymentLogosTestVariant(participations) === 'variant';
}

export {
  getVariantForTest,
  getPaymentLogosTestVariant,
  inPaymentLogosTest,
};

