// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';

import seedrandom from 'seedrandom';

import * as ophan from 'ophan';
import * as cookie from 'helpers/cookie';
import * as storage from 'helpers/storage';
import { tests } from './abtestDefinitions';


// ----- Types ----- //

type TestId = $Keys<typeof tests>;

type OphanABEvent = {
  variantName: string,
  complete: boolean,
  campaignCodes?: string[],
};

export type Participations = {
  [TestId]: string,
}

type OphanABPayload = {
  [TestId]: OphanABEvent,
};

type Audiences = {
  [IsoCountry]: {
    offset: number,
    size: number,
  },
};

export type Test = {
  variants: string[],
  audiences: Audiences,
  isActive: boolean,
  independence?: number,
};

export type Tests = { [testId: string]: Test }


// ----- Setup ----- //

const MVT_COOKIE: string = 'GU_mvt_id';
const MVT_MAX: number = 1000000;


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

function setLocalStorageParticipations(participations: Participations): void {
  storage.setLocal('gu.support.abTests', JSON.stringify(participations));
}

function getParticipationsFromUrl(): ?Participations {

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

  const rng = seedrandom(seed + independence);
  return Math.abs(rng.int32());
}

function assignUserToVariant(mvtId: number, test: Test): string {
  const independence = test.independence || 0;

  const variantIndex = randomNumber(mvtId, independence) % test.variants.length;

  return test.variants[variantIndex];
}

function getParticipations(abTests: Tests, mvtId: number, country: IsoCountry): Participations {

  const currentParticipation = getLocalStorageParticipation();
  const participations: Participations = {};

  Object.keys(abTests).forEach((testId) => {
    const test = abTests[testId];

    if (!test.isActive) {
      return;
    }

    if (testId in currentParticipation) {
      participations[testId] = currentParticipation[testId];
    } else if (userInTest(test.audiences, mvtId, country)) {
      participations[testId] = assignUserToVariant(mvtId, test);
    } else {
      participations[testId] = 'notintest';
    }
  });

  return participations;
}

const buildOphanPayload = (participations: Participations, complete: boolean): OphanABPayload =>
  Object.keys(participations).reduce((payload, participation) => {
    const ophanABEvent: OphanABEvent = {
      variantName: participations[participation],
      complete,
      campaignCodes: [],
    };

    return Object.assign({}, payload, { [participation]: ophanABEvent });
  }, {});

const trackABOphan = (participations: Participations, complete: boolean): void => {
  ophan.record({
    abTestRegister: buildOphanPayload(participations, complete),
  });
};

const init = (country: IsoCountry, abTests: Tests = tests): Participations => {

  const mvt: number = getMvtId();
  const participations: Participations = getParticipations(abTests, mvt, country);
  const urlParticipations: ?Participations = getParticipationsFromUrl();

  setLocalStorageParticipations(Object.assign({}, participations, urlParticipations));
  trackABOphan(participations, false);

  return participations;
};

const getVariantsAsString = (participation: Participations): string => {
  const variants: string[] = [];

  Object.keys(participation).forEach((testId) => {
    variants.push(`${testId}=${participation[(testId: any)]}`);
  });

  return variants.join('; ');
};

const getCurrentParticipations = (): Participations => getLocalStorageParticipation();


// ----- Exports ----- //

export {
  init,
  getVariantsAsString,
  getCurrentParticipations,
};
