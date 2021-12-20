import * as React from 'preact/compat';
import type { $Keys } from 'utility-types';

const breakpoints = {
	mobile: 320,
	mobileMedium: 375,
	mobileLandscape: 480,
	phablet: 660,
	tablet: 740,
	desktop: 980,
	leftCol: 1140,
	wide: 1300,
};

type Breakpoint = $Keys<typeof breakpoints>;

export const useWindowWidth = (): Record<
	string,
	(breakpoint: Breakpoint) => boolean
> => {
	function getWindowWidth() {
		return window.innerWidth;
	}

	const [windowWidth, setWindowWidth] = React.useState(getWindowWidth);
	React.useEffect(() => {
		function handleResize() {
			setWindowWidth(getWindowWidth());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const windowWidthIsGreaterThan = (breakpoint: Breakpoint) =>
		windowWidth >= breakpoints[breakpoint];

	const windowWidthIsLessThan = (breakpoint: Breakpoint) =>
		windowWidth < breakpoints[breakpoint];

	return {
		windowWidthIsGreaterThan,
		windowWidthIsLessThan,
	};
};
