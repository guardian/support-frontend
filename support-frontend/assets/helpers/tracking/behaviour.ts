import { trackComponentEvents } from './trackingOphan';

const trackComponentClick = (componentId: string, value?: string): void => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
			id: componentId,
		},
		action: 'CLICK',
		value,
	});
};

const trackComponentLoad = (componentId: string): void => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
			id: componentId,
		},
		action: 'VIEW',
	});
};

export { trackComponentClick, trackComponentLoad };
