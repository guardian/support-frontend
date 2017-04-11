// ----- Reducers ----- //

export default function reducer(state = 'PAPER+DIGITAL', action) {

  switch (action.type) {
    case 'CHANGE_PAPER_BUNDLE':
      return action.payload;
    default:
      return state;
  }

}
