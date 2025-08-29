import '@testing-library/jest-dom';

// General-purpose mock; any and all functions called off the 'ophan' object
// will be proxied to a mock Jest function
jest.mock('@guardian/ophan-tracker-js/support', () => new Proxy({}, {
  get() {
    return jest.fn();
  },
}));

// General-purpose mock; any and all functions called off the 'ophan' object
// will be proxied to a mock Jest function
jest.mock('@guardian/ophan-tracker-js', () => new Proxy({}, {
  get() {
    return jest.fn();
  },
}));

// window.guardian mock
global.window.guardian = {
  stripeKeyDefaultCurrencies: {
    ONE_OFF: 'mock key',
    REGULAR: 'mock key',
  },
};
