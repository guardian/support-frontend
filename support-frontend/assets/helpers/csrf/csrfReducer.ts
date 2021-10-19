// ----- Imports ----- //
import type { Action } from './csrfActions';
// ----- Types ----- //
export type Csrf = {
	token: string | null | undefined;
};
// ----- Setup ----- //
const initialState: Csrf =
	window.guardian && window.guardian.csrf
		? {
				token: window.guardian.csrf.token,
		  }
		: {
				token: null,
		  }; // ----- Reducer ----- //

export default function csrfReducer(
	state: Csrf = initialState,
	action: Action,
): Csrf {
	switch (action.type) {
		case 'SET_TOKEN':
			return Object.assign({}, state, {
				token: action.name,
			});

		default:
			return state;
	}
}
