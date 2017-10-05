// @flow

// ----- Imports ----- //


import * as ophan from 'ophan';
import { get as getCookie } from 'helpers/cookie';
import { getQueryParameter } from 'helpers/url';
import { deserialiseJsonObject } from 'helpers/utilities';
import type { Participations } from 'helpers/abtest';
import * as storage from 'helpers/storage';


// ----- Types ----- //

export type AcquisitionABTest = {
  name: string,
  variant: string,
};

export type OphanIds = {|
  pageviewId: string,
  visitId: ?string,
  browserId: ?string,
|};

export type ReferrerAcquisitionData = {|
  campaignCode: ?string,
  referrerPageviewId: ?string,
  referrerUrl: ?string,
  componentId: ?string,
  componentType: ?string,
  source: ?string,
  abTest: AcquisitionABTest[],
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
function getCampaign(acquisition: ReferrerAcquisitionData): ?Campaign {

  const campaignCode = acquisition.campaignCode;

  if (!campaignCode) {
    return null;
  }

  return Object.keys(campaigns).find(campaign =>
    campaigns[campaign].includes(campaignCode),
  ) || null;

}

// Stores the acquisition data in sessionStorage.
function storeAcquisition(referrerAcquisitionData: ReferrerAcquisitionData): boolean {

  try {

    const serialised = JSON.stringify(referrerAcquisitionData);
    storage.setSession(ACQUISITIONS_STORAGE_KEY, serialised);

    return true;

  } catch (err) {
    return false;
  }

}

// Reads the acquisition data from sessionStorage.
function readAcquisition(): ?ReferrerAcquisitionData {

  const stored = storage.getSession(ACQUISITIONS_STORAGE_KEY);
  return stored ? deserialiseJsonObject(stored) : null;

}

// Builds the acquisition object from data and other sources.
function buildAcquisition(acquisitionData: Object = {}): ReferrerAcquisitionData {

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
    abTest: acquisitionData.abTests || [],
  };

}

const participationsToAcquisitionABTest = (participations: Participations): AcquisitionABTest[] => {
  const response: AcquisitionABTest[] = [];

  Object.keys(participations).forEach((participation) => {
    response.push({
      name: participation,
      variant: participations[(participation: any)],
    });
  });

  return response;
};

// Returns the acquisition metadata, either from query param or sessionStorage.
// Also stores in sessionStorage if not present or new from param.
function getAcquisition(): ReferrerAcquisitionData {

  const paramData = deserialiseJsonObject(getQueryParameter(ACQUISITIONS_PARAM) || '');

  // Read from param, or read from sessionStorage, or build minimal version.
  const referrerAcquisitionData = buildAcquisition(paramData || readAcquisition() || undefined);
  storeAcquisition(referrerAcquisitionData);

  return referrerAcquisitionData;

}

const getOphanIds = (): OphanIds => ({
  pageviewId: ophan.viewId,
  browserId: getCookie('bwid'),
  visitId: getCookie('vsid'),
});

// ----- Exports ----- //

export {
  getCampaign,
  getAcquisition,
  getOphanIds,
  participationsToAcquisitionABTest,
};
