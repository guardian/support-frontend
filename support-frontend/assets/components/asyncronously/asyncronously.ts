import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';

type PropTypes<T> = {
	loader: Promise<{
		default: ComponentType<T>;
	}>;
	loading: JSX.Element;
	render: (Component: ComponentType<T>) => JSX.Element;
};

function Asyncronously<T>(props: PropTypes<T>): JSX.Element | null {
	const [loaded, setLoaded] = useState(false);

	const componentRef = useRef<ComponentType<T>>();

	const { loading, render, loader } = props;

	useEffect(() => {
		void loader.then((imported) => {
			componentRef.current = imported.default;
			setLoaded(true);
		});
	}, []);

	if (loaded && componentRef.current) {
		return render(componentRef.current);
	}

	return loading;
}

Asyncronously.defaultProps = {
	loading: null,
};

export default Asyncronously;
