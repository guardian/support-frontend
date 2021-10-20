export type Action = {
	type: 'SET_PAYPAL_HAS_LOADED';
};
export const setPayPalHasLoaded = (): Action => ({
	type: 'SET_PAYPAL_HAS_LOADED',
});
