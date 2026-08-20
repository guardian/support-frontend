import '@testing-library/jest-dom';

// Mock for ophan support module
const mockOphanSupport = {
  record: jest.fn(),
  viewId: 'mock-view-id',
  getViewId: jest.fn(() => 'mock-view-id'),
  init: jest.fn(),
  sendInitialEvent: jest.fn(),
};
jest.mock('@guardian/ophan-tracker-js', () => ({
  ...mockOphanSupport,
  record: mockOphanSupport.record,
  viewId: mockOphanSupport.viewId,
  getViewId: mockOphanSupport.getViewId,
  init: mockOphanSupport.init,
  sendInitialEvent: mockOphanSupport.sendInitialEvent,
  default: mockOphanSupport,
}));

// window.guardian mock
global.window.guardian = {
  stripeKeyDefaultCurrencies: {
    ONE_OFF: 'mock key',
    REGULAR: 'mock key',
  },
};
