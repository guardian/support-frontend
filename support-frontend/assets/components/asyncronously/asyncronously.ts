import type { ComponentType } from 'preact';
import { useEffect, useState } from 'preact/hooks';

type PropTypes<T> = {
	loader: Promise<{
		default: ComponentType<T>;
	}>;
	loading: JSX.Element;
	render: (MktConsent: ComponentType<T>) => JSX.Element;
};

function Asyncronously<T>(props: PropTypes<T>): JSX.Element | null {
	const [component, setComponent] = useState<ComponentType<T>>();

	useEffect(() => {
		const { loader } = props;
		void loader.then((imported) => {
			setComponent(imported.default);
		});
	}, []);

	const { loading, render } = props;

	if (component) {
		return render(component);
	}

	return loading;
}

Asyncronously.defaultProps = {
	loading: null,
};

export default Asyncronously;
