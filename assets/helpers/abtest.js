// @flow

const tests = [
  {
    id : 'otherWaysOfContribute',
    variants : [ 'control', 'variantA', 'variantB']
  }
];

// ----- Functions ----- //

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

