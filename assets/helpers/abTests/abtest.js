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

const breakpoints = {
  mobile: 320,
  mobileMedium: 375,
  mobileLandscape: 480,
  phablet: 660,
  tablet: 740,
  desktop: 980,
  leftCol: 1140,
  wide: 1300,
};

type Breakpoint = $Keys<typeof breakpoints>;

type BreakpointRange = {
  minWidth: ?Breakpoint,
  maxWidth: ?Breakpoint,
}

export type Participations = {
  [TestId]: string,
}

type OphanABPayload = {
  [TestId]: OphanABEvent,
};

type Audience = {
  offset: number,
  size: number,
  breakpoint?: BreakpointRange,
};

type Audiences = {
  [IsoCountry | 'ALL']: Audience
};

export type Test = {|
  variants: string[],
  audiences: Audiences,
  isActive: boolean,
  customSegmentCondition?: () => boolean,
  independent: boolean,
  seed: number,
|};

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

function userInBreakpoint(audience: Audience): boolean {

  if (!audience.breakpoint) {
    return true;
  }

  const { minWidth } = audience.breakpoint;
  const minWidthMediaQuery = minWidth ? `(min-width:${breakpoints[minWidth]}px)` : null;

  const { maxWidth } = audience.breakpoint;
  const maxWidthMediaQuery = maxWidth ? `(max-width:${breakpoints[maxWidth]}px)` : null;

  if (!(minWidth || maxWidth)) {
    return true;
  }

  const mediaQuery = minWidthMediaQuery && maxWidthMediaQuery ?
    `${minWidthMediaQuery} and ${maxWidthMediaQuery}` :
    (minWidthMediaQuery || maxWidthMediaQuery);

  return window.matchMedia(mediaQuery).matches;

}

function userInTest(audiences: Audiences, mvtId: number, country: IsoCountry) {

  if (cookie.get('_post_deploy_user')) {
    return false;
  }

  const audience = audiences[country] || audiences.ALL;

  if (!audience) {
    return false;
  }

  const testMin: number = MVT_MAX * audience.offset;
  const testMax: number = testMin + (MVT_MAX * audience.size);

  return (mvtId > testMin) && (mvtId < testMax) && userInBreakpoint(audience);
}

function randomNumber(mvtId: number, independent: boolean, seed: number): number {
  if (!independent) {
    return mvtId;
  }

  const rng = seedrandom(mvtId + seed);
  return Math.abs(rng.int32());
}

function assignUserToVariant(mvtId: number, test: Test): string {
  const { independent, seed } = test;

  const variantIndex = randomNumber(mvtId, independent, seed) % test.variants.length;

  return test.variants[variantIndex];
}

function getParticipations(abTests: Tests, mvtId: number, country: IsoCountry): Participations {

  const currentParticipation = getLocalStorageParticipation();
  const participations: Participations = {};

  Object.keys(abTests).forEach((testId) => {
    const test = abTests[testId];
    const notintest = 'notintest';

    if (!test.isActive) {
      return;
    }

    if (testId in currentParticipation) {
      participations[testId] = currentParticipation[testId];
    } else if (test.customSegmentCondition && !test.customSegmentCondition()) {
      participations[testId] = notintest;
    } else if (userInTest(test.audiences, mvtId, country)) {
      participations[testId] = assignUserToVariant(mvtId, test);
    } else {
      participations[testId] = notintest;
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
