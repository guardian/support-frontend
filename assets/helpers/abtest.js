// @flow

// ----- Imports ----- //

import * as cookie from './cookie';


// ----- Setup ----- //

const MVT_COOKIE = 'GU_mvt_id';
const MVT_MAX = 1000000;


// ----- Tests ----- //

const tests = [
  {
    id: 'otherWaysOfContribute',
    variants: ['control', 'variantA', 'variantB'],
  },
];

// ----- Functions ----- //

// Attempts to retrieve the MVT id from a cookie, or sets it.
function getMvtId(): number {

  let mvtId = cookie.get(MVT_COOKIE);

  if (!mvtId) {

    mvtId = String(Math.random(0, MVT_MAX));
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

function getParticipation(mvtId: number): Object {

  const currentParticipation = getLocalStorageParticipation();
  const participation = {};

  tests.forEach((test) => {

    if (test.id in currentParticipation) {
      participation[test.id] = currentParticipation[test.id];
    } else {

      const variantIndex = mvtId % test.variants.length;
      participation[test.id] = test.variants[variantIndex];

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
  state: AbTestState,
  action: Action): AbTestState => {

  switch (action.type) {

    case 'SET_AB_TEST_VARIANTS': {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
};

