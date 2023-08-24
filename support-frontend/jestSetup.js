import '@testing-library/jest-dom';

// General-purpose mock; any and all functions called off the 'ophan' object
// will be proxied to a mock Jest function
// Ophan is a RequireJS module and Jest hates it
jest.mock('ophan', () => new Proxy({}, {
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
