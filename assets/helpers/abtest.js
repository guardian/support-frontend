// @flow

// ----- Imports ----- //

import * as cookie from './cookie';


// ----- Setup ----- //

const MVT_COOKIE = 'GU_mvt_id';
const MVT_MAX = 1000000;


// ----- Tests ----- //

const tests = [
  {
    id : 'otherWaysOfContribute',
    variants : [ 'control', 'variantA', 'variantB']
  }
];

// ----- Functions ----- //

// Attempts to retrieve the MVT id from a cookie, or sets it.
function getMvtId(): number {

  let mvt_id = cookie.get(MVT_COOKIE);

  if (!mvt_id) {

    mvt_id = Math.random(0, MVT_MAX);
    cookie.set(MVT_COOKIE, mvt_id);

  }

  return mvt_id;

}

export const init = () => {

  //check URL
  //read from localstorage
  const mvt = //read the MVT || or set the MVT
  let response = {};

  for( test of tests) {
    response[test.id] = mvt % test.variants.length;
  }
  return response;
};


export const abTestReducer = (
  state: AbTestState,
  action: Action): AbTestState  => {

  switch (action.type) {

    case 'SET_AB_TEST_VARIANTS': {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
};

