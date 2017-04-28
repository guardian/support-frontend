import reducer from '../reducers'
import { changePaperBundle, changeContribType, changeContribAmountRecurring, changeContribAmountOneOff } from '../../actions/bundlesLandingActions';

describe('reducer tests', () => {

  const initialContrib: ContribState = {
    type: 'RECURRING',
    error: null,
    amount: {
      recurring: {
        value: '5',
        userDefined: false,
      },
      oneOff: {
        value: '25',
        userDefined: false,
      },
    },
  };
  const intialPaperBundle: PaperBundle = 'PAPER+DIGITAL';
  const intialState = { paperBundle: intialPaperBundle, contribution: initialContrib };

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  })
  
});