import { breakpoints } from '@guardian/source/foundations';

const viewportMeta = {
	mobile: {
		name: 'Mobile',
		type: 'mobile',
	},
	mobileMedium: {
		name: 'Mobile Medium',
		type: 'mobile',
	},
	mobileLandscape: {
		name: 'Mobile Landscape',
		type: 'mobile',
	},
	phablet: {
		name: 'Phablet',
		type: 'mobile',
	},
	tablet: {
		name: 'Tablet',
		type: 'tablet',
	},
	desktop: {
		name: 'Desktop',
		type: 'desktop',
	},
	leftCol: {
		name: 'Left Col',
		type: 'desktop',
	},
	wide: {
		name: 'Wide',
		type: 'desktop',
	},
};

const viewportEntries = Object.entries(breakpoints).map(([name, width]) => {
	return [
		name,
		{
			name: viewportMeta[name].name,
			styles: {
				width: `${width}px`,
				height: '100%',
			},
			type: viewportMeta[name].type,
		},
	];
});

export const viewports = Object.fromEntries(viewportEntries);
