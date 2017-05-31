// @flow

// ----- Imports ----- //

import * as cookie from './cookie';


// ----- Setup ----- //

const MVT_COOKIE: string = 'GU_mvt_id';
const MVT_MAX: number = 1000000;


// ----- Types ----- //

type Audience = {
  offset: number,
  size: number,
};

export type Participation = {
  otherWaysOfContribute?: string,
}

type Action = {
  type: 'SET_AB_TEST_PARTICIPATION',
  payload: Participation,
};

type Test = {
  variants: string[],
  audience: Audience,
  isActive: boolean,
};


// ----- Tests ----- //

const tests: {
  otherWaysOfContribute: Test,
} = {
  otherWaysOfContribute: {
    variants: ['control', 'variantA', 'variantB'],
    audience: {
      offset: 0.2,
      size: 0.4,
    },
    isActive: false,
  },
};


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

function getLocalStorageParticipation(): Participation {

  const abtests = localStorage.getItem('gu.support.abTests');

  return abtests ? JSON.parse(abtests) : {};

}

function setLocalStorageParticipation(participation): void {
  localStorage.setItem('gu.support.abTests', JSON.stringify(participation));
}

function getUrlParticipation(): ?Participation {

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

function getParticipation(mvtId: number): Object {

  const currentParticipation = getLocalStorageParticipation();
  const participation = {};

  Object.keys(tests).forEach((testId) => {

    const test = tests[testId];

    if (!test.isActive) {
      return;
    }

    if (testId in currentParticipation) {
      participation[testId] = currentParticipation[testId];
    } else if (userInTest(test.audience, mvtId)) {
      const variantIndex = mvtId % test.variants.length;
      participation[testId] = test.variants[variantIndex];
    } else {
      participation[testId] = 'notintest';
    }

  });

  return participation;

}


// ----- Exports ----- //

export const init = () => {

  const mvt = getMvtId();
  let participation = getParticipation(mvt);

  const urlParticipation = getUrlParticipation();
  participation = Object.assign({}, participation, urlParticipation);

  setLocalStorageParticipation(participation);

  return participation;

};


export const abTestReducer = (
  state: Participation = {},
  action: Action): Participation => {

  switch (action.type) {

    case 'SET_AB_TEST_PARTICIPATION': {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
};

