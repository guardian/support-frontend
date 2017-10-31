// @flow

// ----- Imports ----- //

import shajs from 'sha.js';

import type { IsoCountry } from 'helpers/internationalisation/country';

import * as ophan from 'ophan';
import * as cookie from './cookie';
import * as storage from './storage';


// ----- Setup ----- //

const MVT_COOKIE: string = 'GU_mvt_id';
const MVT_MAX: number = 1000000;


// ----- Types ----- //

type Audiences = {
  [IsoCountry]: {
    offset: number,
    size: number,
  },
};

type TestId = 'addAnnualContributions' | 'usMonthlyVsOneOff';

export type Participations = {
  [TestId]: string,
}

type Test = {
  testId: TestId,
  variants: string[],
  audiences: Audiences,
  isActive: boolean,
  independence?: number,
};


type OphanABEvent = {
  variantName: string,
  complete: boolean,
  campaignCodes?: string[],
};


type OphanABPayload = {
  [TestId]: OphanABEvent,
};


// ----- Tests ----- //

const tests: Test[] = [
  {
    testId: 'addAnnualContributions',
    variants: ['control', 'variant'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
  },

  {
    testId: 'usMonthlyVsOneOff',
    variants: ['one_off', 'monthly'],
    audiences: {
      US: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
  },
];


// ----- Functions ----- //

// Attempts to retrieve the MVT id from a cookie, or sets it.
function getMvtId(): number {

  let mvtId = cookie.get(MVT_COOKIE);

  if (!mvtId) {

    mvtId = String(Math.floor(Math.random() * (MVT_MAX)));
    cookie.set(MVT_COOKIE, mvtId);

  }

  return Number(mvtId);
}

function getLocalStorageParticipation(): Participations {

  const abTests = storage.getLocal('gu.support.abTests');

  return abTests ? JSON.parse(abTests) : {};

}

function setLocalStorageParticipation(participation): void {
  storage.setLocal('gu.support.abTests', JSON.stringify(participation));
}

function getUrlParticipation(): ?Participations {

  const hashUrl = (new URL(document.URL)).hash;

  if (hashUrl.startsWith('#ab-')) {

    const [testId, variant] = hashUrl.substr(4).split('=');
    const test = {};
    test[testId] = variant;

    return test;
  }

  return null;
}

function userInTest(audiences: Audiences, mvtId: number, country: IsoCountry) {

  const audience = audiences[country];

  if (!audience) {
    return false;
  }

  const testMin: number = MVT_MAX * audience.offset;
  const testMax: number = testMin + (MVT_MAX * audience.size);

  return (mvtId > testMin) && (mvtId < testMax);
}

function randomNumber(seed: number, independence: number): number {
  if (independence === 0) {
    return seed;
  }

  return Math.abs(shajs('sha256').update(String(seed + independence)).digest().readInt32BE(0));
}

function assignUserToVariant(mvtId: number, test: Test): string {
  const independence = test.independence || 0;

  const variantIndex = randomNumber(mvtId, independence) % test.variants.length;

  return test.variants[variantIndex];
}

function getParticipation(abTests: Test[], mvtId: number, country: IsoCountry): Participations {

  const currentParticipation = getLocalStorageParticipation();
  const participation:Participations = {};

  abTests.forEach((test) => {

    if (!test.isActive) {
      return;
    }

    if (test.testId in currentParticipation) {
      participation[test.testId] = currentParticipation[test.testId];
    } else if (userInTest(test.audiences, mvtId, country)) {
      participation[test.testId] = assignUserToVariant(mvtId, test);
    } else {
      participation[test.testId] = 'notintest';
    }

  });

  return participation;

}


// ----- Exports ----- //

const init = (country: IsoCountry, abTests: Test[] = tests): Participations => {

  const mvt: number = getMvtId();
  let participation: Participations = getParticipation(abTests, mvt, country);

  const urlParticipation = getUrlParticipation();
  participation = Object.assign({}, participation, urlParticipation);

  setLocalStorageParticipation(participation);

  return participation;

};

const getVariantsAsString = (participation: Participations): string => {
  const variants: string[] = [];

  Object.keys(participation).forEach((testId) => {
    variants.push(`${testId}=${participation[(testId: any)]}`);
  });

  return variants.join('; ');
};

const getCurrentParticipations = (): Participations => getLocalStorageParticipation();

const trackOphan = (
  testId: TestId,
  variant: string,
  complete?: boolean = false,
  campaignCodes?: string[] = [],
): void => {

  const payload: OphanABPayload = {
    [testId]: {
      variantName: variant,
      complete,
      campaignCodes,
    },
  };

  ophan.record({
    abTestRegister: payload,
  });
};

export {
  init,
  getVariantsAsString,
  getCurrentParticipations,
  trackOphan,
};
