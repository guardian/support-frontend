// @flow

// ----- Imports ----- //

import * as cookie from './cookie';


// ----- Setup ----- //

const MVT_COOKIE: string = 'GU_mvt_id';
const MVT_MAX: number = 1000000;


// ----- Tests ----- //

const tests = [
  {
    id: 'otherWaysOfContribute',
    variants: ['control', 'variantA', 'variantB'],
    // The audience has an offset and a size. Both of them are a number
    // between 0 and 1
    audience: {
      offset: 0.2,
      size: 0.4,
    },
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

function getLocalStorageParticipation(): Object {

  const abtests = localStorage.getItem('gu.support.abTests');

  return abtests ? JSON.parse(abtests) : {};

}

function setLocalStorageParticipation(participation): void {
  localStorage.setItem('gu.support.abTests', JSON.stringify(participation));
}

function getUrlParticipation(): ?Object {

  const hashUrl = (new URL(document.URL)).hash;

  if (hashUrl.startsWith('#ab-')) {

    const [testId, variant] = hashUrl.substr(4).split('=');
    const test = {};
    test[testId] = variant;

    return test;

  }

  return null;

}

function userInTest(audience: object, mvtId: number) {
  const testMin: number = MVT_MAX * audience.offset;
  const testMax: number = testMin + (MVT_MAX * audience.size);

  return (mvtId > testMin) && (mvtId < testMax);
}

function getParticipation(mvtId: number): Object {

  const currentParticipation = getLocalStorageParticipation();
  const participation = {};

  tests.forEach((test) => {

    if (test.id in currentParticipation) {
      participation[test.id] = currentParticipation[test.id];
    } else if (userInTest(test.audience, mvtId)) {
      const variantIndex = mvtId % test.variants.length;
      participation[test.id] = test.variants[variantIndex];
    } else {
      participation[test.id] = 'notintest';
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
  state: AbTestState = {},
  action: Action): AbTestState => {

  switch (action.type) {

    case 'SET_AB_TEST_PARTICIPATION': {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
};

