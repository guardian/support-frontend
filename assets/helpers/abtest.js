// @flow

// ----- Imports ----- //

import * as ophan from 'ophan';
import * as cookie from './cookie';
import * as storage from './storage';


// ----- Setup ----- //

const MVT_COOKIE: string = 'GU_mvt_id';
const MVT_MAX: number = 1000000;


// ----- Types ----- //

type Audience = {
  offset: number,
  size: number,
};

type TestId = 'addAnnualContributions';

export type Participations = {
  [TestId]: string,
}

type Action = {
  type: 'SET_AB_TEST_PARTICIPATION',
  payload: Participations,
};

type Test = {
  testId: TestId,
  variants: string[],
  audience: Audience,
  isActive: boolean,
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
    audience: {
      offset: 0,
      size: 1,
    },
    isActive: false,
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

  const abTests = storage.getItem('gu.support.abTests');

  return abTests ? JSON.parse(abTests) : {};

}

function setLocalStorageParticipation(participation): void {
  storage.setItem('gu.support.abTests', JSON.stringify(participation));
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

function userInTest(audience: Audience, mvtId: number) {
  const testMin: number = MVT_MAX * audience.offset;
  const testMax: number = testMin + (MVT_MAX * audience.size);

  return (mvtId > testMin) && (mvtId < testMax);
}

function assignUserToVariant(mvtId: number, test: Test): string {
  const variantIndex = mvtId % test.variants.length;

  return test.variants[variantIndex];
}

function getParticipation(mvtId: number): Participations {

  const currentParticipation = getLocalStorageParticipation();
  const participation:Participations = {};

  tests.forEach((test) => {

    if (!test.isActive) {
      return;
    }

    if (test.testId in currentParticipation) {
      participation[test.testId] = currentParticipation[test.testId];
    } else if (userInTest(test.audience, mvtId)) {
      participation[test.testId] = assignUserToVariant(mvtId, test);
    } else {
      participation[test.testId] = 'notintest';
    }

  });

  return participation;

}


// ----- Exports ----- //

export const init = () => {

  const mvt: number = getMvtId();
  let participation: Participations = getParticipation(mvt);

  const urlParticipation = getUrlParticipation();
  participation = Object.assign({}, participation, urlParticipation);

  setLocalStorageParticipation(participation);

  return participation;

};

export const getVariantsAsString = (participation: Participations): string => {
  const variants: string[] = [];

  Object.keys(participation).forEach((testId) => {
    variants.push(`${testId}=${participation[(testId: any)]}`);
  });

  return variants.join('; ');
};

export const trackOphan = (
  testId: TestId,
  variant: string,
  complete?: boolean = false,
  campaignCodes?: string[] = []): void => {

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

export const abTestReducer = (
  state: Participations = {},
  action: Action): Participations => {

  switch (action.type) {

    case 'SET_AB_TEST_PARTICIPATION': {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
};

