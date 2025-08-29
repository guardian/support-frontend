import '@testing-library/jest-dom';

// Mock for ophan support module
const mockOphanSupport = {
  record: jest.fn(),
  viewId: 'mock-view-id',
  init: jest.fn(),
  sendInitialEvent: jest.fn(),
};
jest.mock('@guardian/ophan-tracker-js/support', () => ({
  ...mockOphanSupport,
  record: mockOphanSupport.record,
  viewId: mockOphanSupport.viewId,
  init: mockOphanSupport.init,
  sendInitialEvent: mockOphanSupport.sendInitialEvent,
  default: mockOphanSupport,
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
