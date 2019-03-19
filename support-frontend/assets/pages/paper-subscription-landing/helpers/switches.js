// @flow

const isDeliveryEnabled = (): boolean => {
  try {
    return window.guardian.settings.switches.subscriptions.homeDelivery === 'On';
  } catch {
    return true;
  }
};

export { isDeliveryEnabled };
