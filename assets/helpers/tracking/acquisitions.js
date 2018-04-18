// @flow

// ----- Imports ----- //


import * as ophan from 'ophan';
import { get as getCookie } from 'helpers/cookie';
import { getQueryParameter } from 'helpers/url';
import { deserialiseJsonObject } from 'helpers/utilities';
import type { Participations } from 'helpers/abTests/abtest';
import * as storage from 'helpers/storage';
import { getAllQueryParamsWithExclusions } from 'helpers/url';


// ----- Types ----- //

export type AcquisitionABTest = {
  name: string,
  variant: string,
};

export type QueryParameter = {
  name: string,
  value: string,
};

export type AcquisitionQueryParameters = Array<QueryParameter>

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
  abTest: ?AcquisitionABTest,
  abTests: ?Array<AcquisitionABTest>,
  queryParameters: ?AcquisitionQueryParameters,
|};


// ----- Setup ----- //

const ACQUISITIONS_PARAM = 'acquisitionData';
const ACQUISITIONS_STORAGE_KEY = 'acquisitionData';


// ----- Campaigns ----- //
const campaigns : {
  [string]: string[],
} = {
  seven_fifty_middle: [
    'gdnwb_copts_editorial_memco_seven_fifty_middle',
  ],
  seven_fifty_end: [
    'gdnwb_copts_editorial_memco_seven_fifty_end',
  ],
  seven_fifty_email: [
    'gdnwb_copts_email_memco_seven_fifty',
  ],
  epic_paradise_paradise_highlight: [
    'gdnwb_copts_memco_epic_paradise_paradise_highlight',
  ],
  epic_paradise_different_highlight: [
    'gdnwb_copts_memco_epic_paradise_different_highlight',
  ],
  epic_paradise_control: [
    'gdnwb_copts_memco_epic_paradise_control',
  ],
  epic_paradise_standfirst: [
    'gdnwb_copts_memco_epic_paradise_standfirst',
  ],
  banner_just_one_control: [
    'banner_just_one_control',
  ],
  banner_just_one_just_one: [
    'banner_just_one_just_one',
  ],
};

export type Campaign = $Keys<typeof campaigns>;


// ----- Functions ----- //

// Retrieves the user's campaign, if known, from the campaign code.
function getCampaign(acquisition: ReferrerAcquisitionData): ?Campaign {

  const { campaignCode } = acquisition;

  if (!campaignCode) {
    return null;
  }

  return Object.keys(campaigns).find(campaign =>
    campaigns[campaign].includes(campaignCode)) || null;

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

const toAcquisitionQueryParameters
  = (parameters: Array<[string, string]>): AcquisitionQueryParameters =>
    parameters.reduce((array, item) => {
      array.push({
        name: item[0],
        value: item[1],
      });
      return array;
    }, []);

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

// Builds the acquisition object from data and other sources.
function buildAcquisition(
  acquisitionData: Object = {},
  abParticipations: Participations,
): ReferrerAcquisitionData {

  const referrerPageviewId = acquisitionData.referrerPageviewId ||
    getQueryParameter('REFPVID');

  const campaignCode = acquisitionData.campaignCode ||
    getQueryParameter('INTCMP');

  const parameterExclusions =
    ['REFPVID', 'INTCMP', 'acquisitionData', 'contributionValue', 'contribType', 'currency'];

  const queryParameters =
    acquisitionData.queryParameters ||
    toAcquisitionQueryParameters(getAllQueryParamsWithExclusions(parameterExclusions));

  const abTests = participationsToAcquisitionABTest(abParticipations);

  if (acquisitionData.abTest) {
    abTests.push(acquisitionData.abTest);
  }

  return {
    referrerPageviewId,
    campaignCode,
    referrerUrl: acquisitionData.referrerUrl,
    componentId: acquisitionData.componentId,
    componentType: acquisitionData.componentType,
    source: acquisitionData.source,
    abTest: acquisitionData.abTest,
    abTests: abTests.length > 0 ? abTests : undefined,
    queryParameters: queryParameters.length > 0 ? queryParameters : undefined,
  };

}

// Returns the acquisition metadata, either from query param or sessionStorage.
// Also stores in sessionStorage if not present or new from param.
function getAcquisition(abParticipations: Participations): ReferrerAcquisitionData {

  const paramData = deserialiseJsonObject(getQueryParameter(ACQUISITIONS_PARAM) || '');

  // Read from param, or read from sessionStorage, or build minimal version.
  const referrerAcquisitionData =
      buildAcquisition(paramData || readAcquisition() || undefined, abParticipations);
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
