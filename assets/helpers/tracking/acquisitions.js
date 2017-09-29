// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { deserialiseJsonObject } from 'helpers/utilities';


// ----- Types ----- //

type AcquisitionABTest = {
  name: string,
  variant: string,
};

export type Acquisition = {|
  referrerPageviewId: ?string,
  campaignCode: ?string,
  referrerUrl: ?string,
  componentId: ?string,
  componentType: ?string,
  source: ?string,
  abTests: AcquisitionABTest[],
|};


// ----- Setup ----- //

const ACQUISITIONS_PARAM = 'acquisitionData';
const ACQUISITIONS_STORAGE_KEY = 'acquisitionData';


// ----- Campaigns ----- //

const baselineTestPrefix = 'gdnwb_copts_memco_sandc_support_baseline_support';

const campaigns : {
  [string]: string[],
} = {
  baseline_test: [
    `${baselineTestPrefix}_banner`,
    `${baselineTestPrefix}_epic`,
    `${baselineTestPrefix}_liveblog`,
    `${baselineTestPrefix}_header_become_supporter`,
    `${baselineTestPrefix}_header_subscribe`,
    `${baselineTestPrefix}_side_menu_become_supporter`,
    `${baselineTestPrefix}_side_menu_subscribe`,
  ],
};

export type Campaign = $Keys<typeof campaigns>;


// ----- Functions ----- //

// Retrieves the user's campaign, if known, from the campaign code.
function getCampaign(acquisition: Acquisition): ?Campaign {

  const campaignCode = acquisition.campaignCode;

  if (!campaignCode) {
    return null;
  }

  return Object.keys(campaigns).find(campaign =>
    campaigns[campaign].includes(campaignCode),
  ) || null;

}

// Stores the acquisition data in sessionStorage.
function storeAcquisition(acquisition: Acquisition): boolean {

  try {

    const serialised = JSON.stringify(acquisition);
    window.sessionStorage.setItem(ACQUISITIONS_STORAGE_KEY, serialised);

    return true;

  } catch (err) {
    return false;
  }

}

// Reads the acquisition data from sessionStorage.
function readAcquisition(): ?Acquisition {

  const stored = window.sessionStorage.getItem(ACQUISITIONS_STORAGE_KEY);
  return stored ? deserialiseJsonObject(stored) : null;

}

// Builds the acquisition object from data and other sources.
function buildAcquisition(acquisitionData: Object = {}): Acquisition {

  const referrerPageviewId = acquisitionData.referrerPageviewId ||
    getQueryParameter('REFPVID') ||
    null;

  const campaignCode = acquisitionData.campaignCode ||
    getQueryParameter('INTCMP') ||
    null;

  return {
    referrerPageviewId,
    campaignCode,
    referrerUrl: acquisitionData.referrerUrl || null,
    componentId: acquisitionData.componentId || null,
    componentType: acquisitionData.componentType || null,
    source: acquisitionData.source || null,
    abTests: acquisitionData.abTests || [],
  };

}

// Builds the acquisition object, and stores in sessionStorage.
function buildAndStore(acquisitionData?: Object): Acquisition {

  const acquisition = buildAcquisition(acquisitionData);
  storeAcquisition(acquisition);

  return acquisition;

}

// Returns the acquisition metadata, either from query param or sessionStorage.
// Also stores in sessionStorage if not present or new from param.
function getAcquisition(): Acquisition {

  const paramData = deserialiseJsonObject(getQueryParameter(ACQUISITIONS_PARAM) || '');

  // Create from the query param data.
  if (paramData) {
    return buildAndStore(paramData);
  }

  // Read from sessionStorage.
  const acquisition = readAcquisition();
  return buildAndStore(acquisition || undefined);

}


// ----- Exports ----- //

export {
  getCampaign,
  getAcquisition,
};
