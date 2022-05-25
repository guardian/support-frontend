import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { Reducer, Store } from 'redux';
import { createStore } from 'redux';

type RenderWithStoreOptions<S> = {
	initialState: S;
	reducer?: Reducer;
	store?: Store<S>;
} & RenderOptions;

export function renderWithStore<StateType>(
	component: React.ReactElement,
	{
		initialState,
		reducer = (state: StateType) => state,
		store = createStore(reducer, initialState),
		...renderOptions
	}: RenderWithStoreOptions<StateType>,
): RenderResult {
	function Wrapper({ children }: { children?: React.ReactNode }) {
		return <Provider store={store}>{children}</Provider>;
	}

	return render(component, {
		wrapper: Wrapper,
		...renderOptions,
	});
}
