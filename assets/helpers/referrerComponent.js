// @flow
import { getSession } from 'helpers/storage';

const isFromEpicOrBanner = [
  'ACQUISITIONS_EPIC',
  'ACQUISITIONS_ENGAGEMENT_BANNER',
].some((componentType: string) => {
  // Try from session storage first. This is so that we get the correct header
  // on subsequent pageviews which don't have the componentType in the URL, e.g.
  // thank you page after PayPal one-off, or after changing country dropdown.
  const searchString = getSession('acquisitionData') || window.location.href;
  return searchString.includes(componentType);
});

export {
  isFromEpicOrBanner,
};
