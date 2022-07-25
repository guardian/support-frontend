export interface PayPalState {
	hasBegunLoading: boolean;
	hasLoaded: boolean;
	buttonReady: boolean;
}

export const initialPayPalState: PayPalState = {
	hasBegunLoading: false,
	hasLoaded: false,
	buttonReady: false,
};
