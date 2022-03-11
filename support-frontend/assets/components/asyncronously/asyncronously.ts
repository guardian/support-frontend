import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';

type PropTypes<T> = {
	loader: Promise<{
		default: ComponentType<T>;
	}>;
	loading: JSX.Element;
	render: (Component: ComponentType<T>) => JSX.Element;
};

function Asyncronously<T>(props: PropTypes<T>): JSX.Element | null {
	const [component, setComponent] = useState<ComponentType<T>>();

	const { loading, render, loader } = props;

	useEffect(() => {
		void loader.then((imported) => {
			// We wrap `imported.default` in a function. If we didn't when `imported.default`
			// is a function component React would interpret it as a callback being passed
			// to `setComponent` and invoke it.
			setComponent(() => imported.default);
		});
	}, []);

	if (component) {
		return render(component);
	}

	return loading;
}

Asyncronously.defaultProps = {
	loading: null,
};

export default Asyncronously;
