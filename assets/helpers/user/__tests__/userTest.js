import { init } from '../user';

// ----- Tests ----- //

describe('user reducer tests', () => {


  it('should handle SET_GNM_MARKETING', () => {
    const email = 'a@exampleemail.com';
    document.cookie = `gu.email=${email}`;

    init
    expect(newState.gnmMarketing).toEqual(preference);
  });
});

