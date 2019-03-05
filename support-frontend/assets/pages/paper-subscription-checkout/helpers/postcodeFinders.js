// @flow
import { postcodeFinderStoreFor } from '../components-checkout/postcodeFinderStore';

// TODO: use local state from hooks
export const postcodeFinders = {
  billing: postcodeFinderStoreFor('billing'),
  delivery: postcodeFinderStoreFor('delivery'),
};

export type PostcodeFinders = $Keys<typeof postcodeFinders>;
