// ----- Imports ----- //
import type { ReferrerAcquisitionData } from "helpers/tracking/acquisitions";
// ----- Consts ----- //
const SUPPORT_AGAIN_HEADER_TEST_NAME = 'header-support-again';
const SUPPORT_AGAIN_HEADER_VARIANT_NAME = 'control';
// ----- Helpers ----- //
export function isInSupportAgainHeaderVariant(acquisitionData: ReferrerAcquisitionData) {
  const {
    abTests
  } = acquisitionData;

  if (!abTests) {
    return false;
  }

  return abTests.some(abTest => abTest.name === SUPPORT_AGAIN_HEADER_TEST_NAME && abTest.variant === SUPPORT_AGAIN_HEADER_VARIANT_NAME);
}