/* eslint-env browser -- allow usage of window/document globals in Storybook */

const defaultPath = '/uk';

const normalisePath = (path) => {
	if (!path || typeof path !== 'string') {
		return defaultPath;
	}

	return path.startsWith('/') ? path : `/${path}`;
};

export function withUKPath(storyFn, context) {
	if (typeof window !== 'undefined') {
		const targetPath = normalisePath(context?.parameters?.ukPath);
		const { history, location } = window;
		const title = typeof document !== 'undefined' ? document.title : '';

		if (location.pathname !== targetPath) {
			history.replaceState(history.state, title, targetPath);
		}
	}

	return storyFn();
}
