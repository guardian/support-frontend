// @flow

// ----- Imports ----- //

import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

// ----- Consts ----- //

const SUPPORT_AGAIN_HEADER_TEST_NAME = 'header-support-again';
const SUPPORT_AGAIN_HEADER_VARIANT_NAME = 'control';

// ----- Helpers ----- //

export function getLongMonth(date: Date) {
  return date.toLocaleDateString('default', { month: 'long' });
}

function nth(d) {
  if (d >= 11 && d <= 13) {
    return 'th';
  }
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function getDateWithOrdinal(date: Date) {
  const dayOfMonth = date.getDate();

  return `${dayOfMonth}${nth(dayOfMonth)}`;
}

export function isInSupportAgainHeaderVariant(acquisitionData: ReferrerAcquisitionData) {
  const { abTests } = acquisitionData;

  if (!abTests) {
    return false;
  }

  return abTests.some(abTest =>
    abTest.name === SUPPORT_AGAIN_HEADER_TEST_NAME &&
      abTest.variant === SUPPORT_AGAIN_HEADER_VARIANT_NAME);
}
